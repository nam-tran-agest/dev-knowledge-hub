'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Category, Tag } from '@/types'

// Categories
export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw new Error(error.message)

    return data || []
}

export async function createCategory(name: string, color?: string): Promise<Category> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('categories')
        .insert({
            user_id: user.id,
            name,
            color: color || '#6366f1'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    return data
}

export async function deleteCategory(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    revalidatePath('/notes')
}

export async function updateCategory(id: string, name: string, color?: string): Promise<Category> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .update({ name, color })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    return data
}

// Tags
export async function getTags(): Promise<Tag[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw new Error(error.message)

    return data || []
}

export async function createTag(name: string): Promise<Tag> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('tags')
        .insert({
            user_id: user.id,
            name
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    revalidatePath('/snippets')
    revalidatePath('/bugs')
    return data
}

export async function deleteTag(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('tags').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    revalidatePath('/snippets')
    revalidatePath('/bugs')
}

export async function updateTag(id: string, name: string): Promise<Tag> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('tags')
        .update({ name })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    revalidatePath('/snippets')
    revalidatePath('/bugs')
    return data
}
