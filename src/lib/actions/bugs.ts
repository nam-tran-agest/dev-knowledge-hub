'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Bug, CreateBugInput, UpdateBugInput } from '@/types'

export async function getBugs(params?: {
    resolved?: boolean
    search?: string
    limit?: number
    offset?: number
}): Promise<{ data: Bug[]; count: number }> {
    const supabase = await createClient()

    let query = supabase
        .from('bugs')
        .select(`
      *,
      tags:bug_tags(tag:tags(*))
    `, { count: 'exact' })
        .order('created_at', { ascending: false })

    if (params?.resolved !== undefined) {
        query = query.eq('resolved', params.resolved)
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

    const transformedData = data?.map(bug => ({
        ...bug,
        tags: bug.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    })) || []

    return { data: transformedData, count: count || 0 }
}

export async function getBug(id: string): Promise<Bug | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('bugs')
        .select(`
      *,
      tags:bug_tags(tag:tags(*))
    `)
        .eq('id', id)
        .single()

    if (error) return null

    return {
        ...data,
        tags: data.tags?.map((t: { tag: { id: string; name: string } }) => t.tag) || []
    }
}

export async function createBug(input: CreateBugInput): Promise<Bug> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('bugs')
        .insert({
            user_id: user.id,
            title: input.title,
            error_message: input.error_message || null,
            stack_trace: input.stack_trace || null,
            root_cause: input.root_cause || null,
            solution: input.solution || null,
            resolved: input.resolved || false
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    if (input.tagIds?.length) {
        await supabase.from('bug_tags').insert(
            input.tagIds.map(tagId => ({ bug_id: data.id, tag_id: tagId }))
        )
    }

    revalidatePath('/bugs')
    redirect(`/bugs/${data.id}`)
}

export async function updateBug(id: string, input: UpdateBugInput): Promise<Bug> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.error_message !== undefined) updateData.error_message = input.error_message
    if (input.stack_trace !== undefined) updateData.stack_trace = input.stack_trace
    if (input.root_cause !== undefined) updateData.root_cause = input.root_cause
    if (input.solution !== undefined) updateData.solution = input.solution
    if (input.resolved !== undefined) updateData.resolved = input.resolved

    const { data, error } = await supabase
        .from('bugs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    if (input.tagIds !== undefined) {
        await supabase.from('bug_tags').delete().eq('bug_id', id)
        if (input.tagIds.length) {
            await supabase.from('bug_tags').insert(
                input.tagIds.map(tagId => ({ bug_id: id, tag_id: tagId }))
            )
        }
    }

    revalidatePath('/bugs')
    revalidatePath(`/bugs/${id}`)
    return data
}

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

export async function deleteBug(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('bugs').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/bugs')
    redirect('/bugs')
}
