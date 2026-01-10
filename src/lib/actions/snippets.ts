'use server'

import { getAll, getById, create, update, deleteEntity } from './base-crud'
import { redirect } from 'next/navigation'
import type { Snippet, CreateSnippetInput, UpdateSnippetInput } from '@/types'

// Configuration for snippet CRUD operations
const snippetConfig = {
  tableName: 'snippets',
  tagJunctionTable: 'snippet_tags',
  tagColumn: 'snippet',
  revalidatePaths: ['/snippets']
}

// Export CRUD operations
export async function getSnippets(params?: Parameters<typeof getAll>[1]) {
  return getAll<Snippet>(snippetConfig, params)
}

export async function getSnippet(id: string) {
  return getById<Snippet>(snippetConfig, id)
}

// Custom create with redirect and defaults
export async function createSnippet(input: CreateSnippetInput): Promise<Snippet> {
  const snippet = await create<Snippet>(snippetConfig, {
    title: input.title,
    content: input.content,
    language: input.language || 'javascript',
    type: input.type || 'code',
    description: input.description || null,
    tagIds: input.tagIds
  })
  redirect(`/snippets/${snippet.id}`)
}

// Custom update
export async function updateSnippet(id: string, input: UpdateSnippetInput): Promise<Snippet> {
  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title
  if (input.content !== undefined) updateData.content = input.content
  if (input.language !== undefined) updateData.language = input.language
  if (input.type !== undefined) updateData.type = input.type
  if (input.description !== undefined) updateData.description = input.description
  if (input.tagIds !== undefined) updateData.tagIds = input.tagIds
  
  return update<Snippet>(snippetConfig, id, updateData)
}

// Custom delete with redirect
export async function deleteSnippet(id: string): Promise<void> {
  await deleteEntity<Snippet>(snippetConfig, id)
  redirect('/snippets')
}
