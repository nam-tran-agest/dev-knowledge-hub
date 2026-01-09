'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types'

export async function getNotes(params?: {
    categoryId?: string
    tagIds?: string[]
    search?: string
    limit?: number
    offset?: number
}): Promise<{ data: Note[]; count: number }> {
    const supabase = await createClient()

    let query = supabase
        .from('notes')
        .select(`
      *,
      category:categories(*),
      tags:note_tags(tag:tags(*))
    `, { count: 'exact' })
        .order('created_at', { ascending: false })

    if (params?.categoryId) {
        query = query.eq('category_id', params.categoryId)
    }

    if (params?.search) {
        query = query.textSearch('search_vector', params.search)
    }

    if (params?.limit) {
        query = query.limit(params.limit)
    }

    if (params?.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)

    // Transform the data to flatten tags
    const transformedData = data?.map(note => ({
        ...note,
        tags: note.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    })) || []

    return { data: transformedData, count: count || 0 }
}

export async function getNote(id: string): Promise<Note | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('notes')
        .select(`
      *,
      category:categories(*),
      tags:note_tags(tag:tags(*))
    `)
        .eq('id', id)
        .single()

    if (error) return null

    return {
        ...data,
        tags: data.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    }
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('notes')
        .insert({
            user_id: user.id,
            title: input.title,
            content: input.content || '',
            category_id: input.categoryId || null
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Handle tags if provided
    if (input.tagIds?.length) {
        await supabase.from('note_tags').insert(
            input.tagIds.map(tagId => ({ note_id: data.id, tag_id: tagId }))
        )
    }

    revalidatePath('/notes')
    redirect(`/notes/${data.id}`)
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.content !== undefined) updateData.content = input.content
    if (input.categoryId !== undefined) updateData.category_id = input.categoryId

    const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Update tags
    if (input.tagIds !== undefined) {
        await supabase.from('note_tags').delete().eq('note_id', id)
        if (input.tagIds.length) {
            await supabase.from('note_tags').insert(
                input.tagIds.map(tagId => ({ note_id: id, tag_id: tagId }))
            )
        }
    }

    revalidatePath('/notes')
    revalidatePath(`/notes/${id}`)
    return data
}

export async function deleteNote(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('notes').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    redirect('/notes')
}
