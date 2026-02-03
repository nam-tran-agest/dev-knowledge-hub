/**
 * Generic CRUD helper functions to reduce code duplication
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BaseEntity } from '@/types'
import { ERROR_MESSAGES } from '@/lib/utils/error-handler'

interface CRUDConfig<T> {
  tableName: string
  tagJunctionTable?: string
  tagColumn?: string
  transformData?: (data: unknown) => T
  revalidatePaths?: string[]
}

// Mock "Guest" user for no-login mode
const GUEST_ID = '00000000-0000-0000-0000-000000000000'

/**
 * Get authenticated user
 */
async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // If no user/error, return a Guest user instead of throwing
  if (error || !user) {
    // console.warn('Returning GUEST user (No Login Mode)')
    return {
      id: GUEST_ID,
      email: 'guest@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString()
    } as any // Cast to any to avoid complex User type matching
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
 * Generic get all with filters
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
  const supabase = await createClient()

  let selectQuery = '*'
  if (config.tagJunctionTable) {
    selectQuery += `, tags:${config.tagJunctionTable}(tag:tags(*))`
  }

  // Add category if applicable
  if (params?.categoryId !== undefined) {
    selectQuery += ', category:categories(*)'
  }

  let query = supabase
    .from(config.tableName)
    .select(selectQuery, { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply category filter
  if (params?.categoryId) {
    query = query.eq('category_id', params.categoryId)
  }

  // Apply search
  if (params?.search) {
    query = query.textSearch('search_vector', params.search)
  }

  // Apply custom filters
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
  }

  // Apply pagination
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
    throw new Error(error.message)
  }

  // Transform data
  const transformedData = data?.map(item => {
    if (typeof item !== 'object' || item === null) return item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformed = Object.assign({}, item) as any

    if (config.tagJunctionTable && 'tags' in transformed && transformed.tags) {
      transformed.tags = transformTags(transformed.tags as unknown[])
    }

    return config.transformData ? config.transformData(transformed) : transformed
  }) || []

  return { data: transformedData as T[], count: count || 0 }
}

/**
 * Generic get by ID
 */
export async function getById<T extends BaseEntity>(
  config: CRUDConfig<T>,
  id: string
): Promise<T | null> {
  const supabase = await createClient()

  let selectQuery = '*'
  if (config.tagJunctionTable) {
    selectQuery += `, tags:${config.tagJunctionTable}(tag:tags(*))`
  }

  const { data, error } = await supabase
    .from(config.tableName)
    .select(selectQuery)
    .eq('id', id)
    .single()

  if (error) return null

  if (typeof data !== 'object' || data === null) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformed = Object.assign({}, data) as any
  if (config.tagJunctionTable && 'tags' in transformed && transformed.tags) {
    transformed.tags = transformTags(transformed.tags as unknown[])
  }

  return config.transformData ? config.transformData(transformed) : transformed as T
}

/**
 * Generic create
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

  // Handle tags if provided
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

  // Revalidate paths
  config.revalidatePaths?.forEach(path => revalidatePath(path))

  return data as T
}

/**
 * Generic update
 */
export async function update<T extends BaseEntity>(
  config: CRUDConfig<T>,
  id: string,
  input: Record<string, unknown>
): Promise<T> {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { tagIds, ...updateFields } = input

  // Build update object dynamically
  const updateData: Record<string, unknown> = {}
  Object.entries(updateFields).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value
    }
  })

  // Update main record
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

  // Handle tags if provided and config supports it
  if (tagIds !== undefined && config.tagJunctionTable) {
    const junctionIdColumn = `${config.tagColumn || config.tableName.slice(0, -1)}_id`

    // Delete existing tags
    await supabase
      .from(config.tagJunctionTable)
      .delete()
      .eq(junctionIdColumn, id)

    // Insert new tags
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

  // Revalidate paths
  config.revalidatePaths?.forEach(path => revalidatePath(path))

  return data as T
}

/**
 * Generic delete
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

  // Revalidate paths
  config.revalidatePaths?.forEach(path => revalidatePath(path))
}
