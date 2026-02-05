'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Category, Tag } from '@/types'

// Categories
export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('kb_categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return data || []
}

export async function createCategory(name: string, color?: string): Promise<Category> {
    // Disabled for now as we use seeded categories
    throw new Error('Category creation is currently disabled')
}

export async function deleteCategory(id: string): Promise<void> {
    // Disabled for now
    throw new Error('Category deletion is currently disabled')
}

export async function updateCategory(id: string, name: string, color?: string): Promise<Category> {
    // Disabled for now
    throw new Error('Category updates are currently disabled')
}

// Tags
export async function getTags(): Promise<Tag[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('kb_tags')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching tags:', error)
        return []
    }

    return data || []
}

export async function createTag(name: string): Promise<Tag> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data, error } = await supabase
        .from('kb_tags')
        .insert({
            user_id: user.id,
            name
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    return data
}

export async function deleteTag(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('kb_tags').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
}

export async function updateTag(id: string, name: string): Promise<Tag> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('kb_tags')
        .update({ name })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/notes')
    return data
}
