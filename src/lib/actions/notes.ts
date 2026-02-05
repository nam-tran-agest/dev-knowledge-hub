'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note'

export async function getNotes(params?: { categorySlug?: string, search?: string, limit?: number, offset?: number }) {
  const supabase = await createClient()

  let query = supabase
    .from('kb_notes_unified')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })

  if (params?.categorySlug && params.categorySlug !== 'all') {
    query = query.eq('category_slug', params.categorySlug)
  }

  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`)
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching notes:', error)
    return { data: [], count: 0 }
  }

  // Transform data to match Note interface
  // The unified view already joins categories so we have category_name, category_color, etc.
  const notes = data.map((item: any) => ({
    ...item,
    category: {
      name: item.category_name,
      color: item.category_color,
      icon: item.category_icon,
      slug: item.category_slug
    }
  }))

  return { data: notes as Note[], count }
}

export async function getNote(id: string) {
  const supabase = await createClient()

  // For getting a single note, we can query the unified view as well to handle ID lookup across all tables
  const { data, error } = await supabase
    .from('kb_notes_unified')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null

  return {
    ...data,
    category: {
      name: data.category_name,
      color: data.category_color,
      icon: data.category_icon,
      slug: data.category_slug
    }
  } as Note
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Determine target table based on slug
  const categorySlug = input.categorySlug || 'work' // Default to work if not provided
  const targetTable = `kb_notes_${categorySlug}`

  // Validate allowed categories
  const allowedCategories = ['work', 'learn', 'ideas', 'life']
  if (!allowedCategories.includes(categorySlug)) {
    throw new Error(`Invalid category: ${categorySlug}`)
  }

  const { data, error } = await supabase
    .from(targetTable)
    .insert({
      title: input.title,
      content: input.content,
      // category_slug is DEFAULT set in the table schema, but we can pass it explicitly too
      category_slug: categorySlug,
      tags: input.tags || [],
      user_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    throw new Error('Failed to create note')
  }

  revalidatePath('/notes')
  redirect(`/notes/${data.id}`)
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  const supabase = await createClient()

  // First we need to find which table this note belongs to.
  // We can query the unified view to find the source_table or category_slug.
  const { data: currentNote, error: fetchError } = await supabase
    .from('kb_notes_unified')
    .select('category_slug')
    .eq('id', id)
    .single()

  if (fetchError || !currentNote) {
    throw new Error('Note not found')
  }

  const categorySlug = currentNote.category_slug
  const targetTable = `kb_notes_${categorySlug}`

  const updateData: any = { updated_at: new Date().toISOString() }
  if (input.title !== undefined) updateData.title = input.title
  if (input.content !== undefined) updateData.content = input.content
  if (input.tags !== undefined) updateData.tags = input.tags

  // Note: Moving notes between categories (changing tables) is complex (Insert + Delete).
  // For this version, we prevent changing category_slug in update.
  if (input.categorySlug && input.categorySlug !== categorySlug) {
    throw new Error('Moving notes between categories is not yet supported in this version.')
  }

  const { data, error } = await supabase
    .from(targetTable)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    throw new Error('Failed to update note')
  }

  // We need to fetch the full object again to return compliant Note object with category info
  // Or construct it manually. Re-fetching getNote(id) is safer.
  const updatedNote = await getNote(id)
  if (!updatedNote) throw new Error('Failed to retrieve updated note')

  revalidatePath('/notes')
  return updatedNote
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient()

  // Find table first
  const { data: currentNote, error: fetchError } = await supabase
    .from('kb_notes_unified')
    .select('category_slug')
    .eq('id', id)
    .single()

  if (fetchError || !currentNote) {
    // Functionally equivalent to already deleted
    return
  }

  const targetTable = `kb_notes_${currentNote.category_slug}`

  const { error } = await supabase
    .from(targetTable)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting note:', error)
    throw new Error('Failed to delete note')
  }

  revalidatePath('/notes')
  redirect('/notes')
}

