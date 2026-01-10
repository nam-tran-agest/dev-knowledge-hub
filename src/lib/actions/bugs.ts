'use server'

import { getAll, getById, create, update, deleteEntity } from './base-crud'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Bug, CreateBugInput, UpdateBugInput } from '@/types'

// Configuration for bug CRUD operations
const bugConfig = {
  tableName: 'bugs',
  tagJunctionTable: 'bug_tags',
  tagColumn: 'bug',
  revalidatePaths: ['/bugs']
}

// Export CRUD operations
export async function getBugs(params?: Parameters<typeof getAll>[1]) {
  return getAll<Bug>(bugConfig, params)
}

export async function getBug(id: string) {
  return getById<Bug>(bugConfig, id)
}

// Custom create with redirect and defaults
export async function createBug(input: CreateBugInput): Promise<Bug> {
  const bug = await create<Bug>(bugConfig, {
    title: input.title,
    error_message: input.error_message || null,
    stack_trace: input.stack_trace || null,
    root_cause: input.root_cause || null,
    solution: input.solution || null,
    resolved: input.resolved || false,
    tagIds: input.tagIds
  })
  redirect(`/bugs/${bug.id}`)
}

// Custom update
export async function updateBug(id: string, input: UpdateBugInput): Promise<Bug> {
  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title
  if (input.error_message !== undefined) updateData.error_message = input.error_message
  if (input.stack_trace !== undefined) updateData.stack_trace = input.stack_trace
  if (input.root_cause !== undefined) updateData.root_cause = input.root_cause
  if (input.solution !== undefined) updateData.solution = input.solution
  if (input.resolved !== undefined) updateData.resolved = input.resolved
  if (input.tagIds !== undefined) updateData.tagIds = input.tagIds
  
  return update<Bug>(bugConfig, id, updateData)
}

// Custom toggle resolved status
export async function toggleBugResolved(id: string): Promise<Bug> {
  const supabase = await createClient()

  const { data: bug } = await supabase
    .from('bugs')
    .select('resolved')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('bugs')
    .update({ resolved: !bug?.resolved })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/bugs')
  revalidatePath(`/bugs/${id}`)
  return data
}

// Custom delete with redirect
export async function deleteBug(id: string): Promise<void> {
  await bugCRUD.delete(id)
  redirect('/bugs')
}
