'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types'

export async function getTasks(params?: {
    status?: TaskStatus
}): Promise<Task[]> {
    const supabase = await createClient()

    let query = supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

    if (params?.status) {
        query = query.eq('status', params.status)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return data || []
}

export async function getTask(id: string): Promise<Task | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return null
    return data
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Get max position for the status column
    const { data: maxPositionData } = await supabase
        .from('tasks')
        .select('position')
        .eq('status', input.status || 'todo')
        .order('position', { ascending: false })
        .limit(1)
        .single()

    const position = (maxPositionData?.position || 0) + 1

    const { data, error } = await supabase
        .from('tasks')
        .insert({
            user_id: user.id,
            title: input.title,
            description: input.description || null,
            status: input.status || 'todo',
            deadline: input.deadline || null,
            position
        })
        .select()
        .single()

    if (error) throw new Error(error.message)

    // Handle task links
    if (input.noteIds?.length) {
        await supabase.from('task_links').insert(
            input.noteIds.map(noteId => ({ task_id: data.id, note_id: noteId }))
        )
    }

    if (input.snippetIds?.length) {
        await supabase.from('task_links').insert(
            input.snippetIds.map(snippetId => ({ task_id: data.id, snippet_id: snippetId }))
        )
    }

    revalidatePath('/tasks')
    return data
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {}
    if (input.title !== undefined) updateData.title = input.title
    if (input.description !== undefined) updateData.description = input.description
    if (input.status !== undefined) updateData.status = input.status
    if (input.deadline !== undefined) updateData.deadline = input.deadline
    if (input.position !== undefined) updateData.position = input.position

    const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/tasks')
    return data
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const supabase = await createClient()

    // Get max position for the new status column
    const { data: maxPositionData } = await supabase
        .from('tasks')
        .select('position')
        .eq('status', status)
        .order('position', { ascending: false })
        .limit(1)
        .single()

    const position = (maxPositionData?.position || 0) + 1

    const { data, error } = await supabase
        .from('tasks')
        .update({ status, position })
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(error.message)

    revalidatePath('/tasks')
    return data
}

export async function reorderTasks(tasks: { id: string; position: number; status: TaskStatus }[]): Promise<void> {
    const supabase = await createClient()

    await Promise.all(
        tasks.map(task =>
            supabase
                .from('tasks')
                .update({ position: task.position, status: task.status })
                .eq('id', task.id)
        )
    )

    revalidatePath('/tasks')
}

export async function deleteTask(id: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) throw new Error(error.message)

    revalidatePath('/tasks')
}
