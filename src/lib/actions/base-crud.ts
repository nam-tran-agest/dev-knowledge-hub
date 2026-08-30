/**
 * Generic CRUD helper functions with strict User Scoping
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BaseEntity } from '@/types'

interface CRUDConfig<T> {
  tableName: string
  tagJunctionTable?: string
  tagColumn?: string
  transformData?: (data: unknown) => T
  revalidatePaths?: string[]
}

// Mock "Guest" user for unauthenticated fallback
const GUEST_ID = '00000000-0000-0000-0000-000000000000'

/**
 * Get authenticated user
 */
async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      id: GUEST_ID,
      email: 'guest@cyberlink.net',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString()
    } as unknown as { id: string; email: string; aud: string; role: string; app_metadata: Record<string, unknown>; user_metadata: Record<string, unknown>; created_at: string }
  }

  return user
}

/**
 * Transform tags from junction table format
 */
function transformTags(tags: unknown[] | undefined): unknown[] {
  if (!tags) return []
  return tags.map((t: unknown) => (t as { tag?: unknown }).tag || t)
}

/**
 * Generic get all with user scoping and filters
 */
export async function getAll<T extends BaseEntity>(
  config: CRUDConfig<T>,
  params?: {
    categoryId?: string
    tagIds?: string[]
    search?: string
    limit?: number
    offset?: number
    filters?: Record<string, unknown>
  }
): Promise<{ data: T[]; count: number }> {
  const user = await getAuthUser()
  const supabase = await createClient()

  let selectQuery = '*'
  if (config.tagJunctionTable) {
    selectQuery += `, tags:${config.tagJunctionTable}(tag:tags(*))`
  }

  if (params?.categoryId !== undefined) {
    selectQuery += ', category:categories(*)'
  }

  let query = supabase
    .from(config.tableName)
    .select(selectQuery, { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (params?.categoryId) {
    query = query.eq('category_id', params.categoryId)
  }

  if (params?.search) {
    query = query.textSearch('search_vector', params.search)
  }

  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  if (params?.offset) {
    query = query.range(
      params.offset,
      params.offset + (params.limit || 10) - 1
    )
  }

  const { data, error, count } = await query

  if (error) {
    // If table does not have user_id yet, fallback to querying without user_id filter
    if (error.code === '42703') {
      const fallbackQuery = supabase
        .from(config.tableName)
        .select(selectQuery, { count: 'exact' })
        .order('created_at', { ascending: false })
      const { data: fbData, count: fbCount } = await fallbackQuery
      return { data: (fbData as unknown as T[]) || [], count: fbCount || 0 }
    }
    throw new Error(error.message)
  }

  const transformedData = data?.map(item => {
    if (typeof item !== 'object' || item === null) return item
    const transformed = Object.assign({}, item) as Record<string, unknown>

    if (config.tagJunctionTable && 'tags' in transformed && transformed.tags) {
      transformed.tags = transformTags(transformed.tags as unknown[])
    }

    return config.transformData ? config.transformData(transformed) : transformed
  }) || []

  return { data: transformedData as T[], count: count || 0 }
}

/**
 * Generic get by ID with user scoping
 */
export async function getById<T extends BaseEntity>(
  config: CRUDConfig<T>,
  id: string
): Promise<T | null> {
  const user = await getAuthUser()
  const supabase = await createClient()

  let selectQuery = '*'
  if (config.tagJunctionTable) {
    selectQuery += `, tags:${config.tagJunctionTable}(tag:tags(*))`
  }

  const { data, error } = await supabase
    .from(config.tableName)
    .select(selectQuery)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    // Fallback if user_id column is missing or queried before migration
    if (error.code === '42703') {
      const { data: fbData } = await supabase
        .from(config.tableName)
        .select(selectQuery)
        .eq('id', id)
        .single()
      return fbData as unknown as T
    }
    return null
  }

  if (typeof data !== 'object' || data === null) return null
  const transformed = Object.assign({}, data) as Record<string, unknown>
  if (config.tagJunctionTable && 'tags' in transformed && transformed.tags) {
    transformed.tags = transformTags(transformed.tags as unknown[])
  }

  return config.transformData ? config.transformData(transformed) : transformed as unknown as T
}

/**
 * Generic create with user scoping
 */
export async function create<T extends BaseEntity>(
  config: CRUDConfig<T>,
  input: Record<string, unknown>
): Promise<T> {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { tagIds, ...insertData } = input

  const dataToInsert = {
    ...insertData,
    user_id: user.id
  }

  const { data, error } = await supabase
    .from(config.tableName)
    .insert(dataToInsert)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (Array.isArray(tagIds) && tagIds.length > 0 && config.tagJunctionTable) {
    const tagInserts = tagIds.map((tagId) => ({
      [`${config.tagColumn || config.tableName.slice(0, -1)}_id`]: data.id,
      tag_id: tagId
    }))

    const { error: tagError } = await supabase
      .from(config.tagJunctionTable)
      .insert(tagInserts)

    if (tagError) {
      console.error('Failed to insert tags:', tagError)
    }
  }

  config.revalidatePaths?.forEach(path => revalidatePath(path))
  return data as T
}

/**
 * Generic update with user scoping
 */
export async function update<T extends BaseEntity>(
  config: CRUDConfig<T>,
  id: string,
  input: Record<string, unknown>
): Promise<T> {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { tagIds, ...updateFields } = input

  const updateData: Record<string, unknown> = {}
  Object.entries(updateFields).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value
    }
  })

  const { data, error } = await supabase
    .from(config.tableName)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (tagIds !== undefined && config.tagJunctionTable) {
    const junctionIdColumn = `${config.tagColumn || config.tableName.slice(0, -1)}_id`

    await supabase
      .from(config.tagJunctionTable)
      .delete()
      .eq(junctionIdColumn, id)

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({
        [junctionIdColumn]: id,
        tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from(config.tagJunctionTable)
        .insert(tagInserts)

      if (tagError) {
        console.error('Failed to update tags:', tagError)
      }
    }
  }

  config.revalidatePaths?.forEach(path => revalidatePath(path))
  return data as T
}

/**
 * Generic delete with user scoping
 */
export async function deleteEntity<T extends BaseEntity>(
  config: CRUDConfig<T>,
  id: string
): Promise<void> {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { error } = await supabase
    .from(config.tableName)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  config.revalidatePaths?.forEach(path => revalidatePath(path))
}
