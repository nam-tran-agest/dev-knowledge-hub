'use server'

import { getAll, getById, create, update, deleteEntity } from './base-crud'
import { redirect } from 'next/navigation'
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types'

// Configuration for note CRUD operations
const noteConfig = {
  tableName: 'notes',
  tagJunctionTable: 'note_tags',
  tagColumn: 'note',
  revalidatePaths: ['/notes']
}

// Export CRUD operations
export async function getNotes(params?: Parameters<typeof getAll>[1]) {
  return getAll<Note>(noteConfig, params)
}

export async function getNote(id: string) {
  return getById<Note>(noteConfig, id)
}

// Custom create with redirect
export async function createNote(input: CreateNoteInput): Promise<Note> {
  console.log('🔵 createNote received:', {
    title: input.title,
    content: input.content,
    contentLength: input.content?.length || 0,
    categoryId: input.categoryId,
    tagIds: input.tagIds
  })
  
  const dataToInsert = {
    title: input.title,
    content: input.content || null,
    category_id: input.categoryId || null,
    tagIds: input.tagIds
  }
  
  console.log('🟢 Inserting to DB:', dataToInsert)
  const note = await create<Note>(noteConfig, dataToInsert)
  console.log('✅ Note created:', note.id)
  redirect(`/notes/${note.id}`)
}

// Custom update
export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  const updateData: Record<string, unknown> = {}
  if (input.title !== undefined) updateData.title = input.title
  if (input.content !== undefined) updateData.content = input.content
  if (input.categoryId !== undefined) updateData.category_id = input.categoryId
  if (input.tagIds !== undefined) updateData.tagIds = input.tagIds
  
  return update<Note>(noteConfig, id, updateData)
}

// Custom delete with redirect
export async function deleteNote(id: string): Promise<void> {
  await deleteEntity<Note>(noteConfig, id)
  redirect('/notes')
}

