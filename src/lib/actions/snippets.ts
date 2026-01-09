'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Snippet, CreateSnippetInput, UpdateSnippetInput } from '@/types'

export async function getSnippets(params?: {
    language?: string
    type?: 'code' | 'prompt'
    search?: string
    limit?: number
    offset?: number
}): Promise<{ data: Snippet[]; count: number }> {
    const supabase = await createClient()

    let query = supabase
        .from('snippets')
        .select(`
      *,
      tags:snippet_tags(tag:tags(*))
    `, { count: 'exact' })
        .order('created_at', { ascending: false })

    if (params?.language) {
        query = query.eq('language', params.language)
    }

    if (params?.type) {
        query = query.eq('type', params.type)
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

    const transformedData = data?.map(snippet => ({
        ...snippet,
        tags: snippet.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    })) || []

    return { data: transformedData, count: count || 0 }
}

export async function getSnippet(id: string): Promise<Snippet | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('snippets')
        .select(`
      *,
      tags:snippet_tags(tag:tags(*))
    `)
        .eq('id', id)
        .single()

    if (error) return null

    return {
        ...data,
        tags: data.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    }
}

export async function createSnippet(input: CreateSnippetInput): Promise<Snippet> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('snippets')
        .insert({
            user_id: user.id,
            title: input.title,
            content: input.content,
            language: input.language || 'javascript',
            type: input.type || 'code',
            description: input.description || null
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    if (input.tagIds?.length) {
        await supabase.from('snippet_tags').insert(
            input.tagIds.map(tagId => ({ snippet_id: data.id, tag_id: tagId }))
        )
    }

    revalidatePath('/snippets')
    redirect(`/snippets/${data.id}`)
}

export async function updateSnippet(id: string, input: UpdateSnippetInput): Promise<Snippet> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.content !== undefined) updateData.content = input.content
    if (input.language !== undefined) updateData.language = input.language
    if (input.type !== undefined) updateData.type = input.type
    if (input.description !== undefined) updateData.description = input.description

    const { data, error } = await supabase
        .from('snippets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    if (input.tagIds !== undefined) {
        await supabase.from('snippet_tags').delete().eq('snippet_id', id)
        if (input.tagIds.length) {
            await supabase.from('snippet_tags').insert(
                input.tagIds.map(tagId => ({ snippet_id: id, tag_id: tagId }))
            )
        }
    }

    revalidatePath('/snippets')
    revalidatePath(`/snippets/${id}`)
    return data
}

export async function deleteSnippet(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('snippets').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/snippets')
    redirect('/snippets')
}
