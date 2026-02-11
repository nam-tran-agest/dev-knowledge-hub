'use server'

import { create, update, deleteEntity, getAll, getById } from '@/lib/actions/base-crud'
import { Task } from '@/features/working/types'

const CONFIG = {
    tableName: 'tasks',
    tagJunctionTable: 'task_tags',
    tagColumn: 'task_id',
    revalidatePaths: ['/working', '/[locale]/working']
}

export async function getTasks(projectId?: string) {
    const filters: Record<string, unknown> = {}
    if (projectId) {
        filters.project_id = projectId
    }

    const { data } = await getAll<Task>(CONFIG, { filters })
    return data
}

export async function getTaskById(id: string) {
    return await getById<Task>(CONFIG, id)
}

export async function createTask(input: Record<string, unknown>) {
    return await create<Task>(CONFIG, input)
}

export async function updateTask(id: string, input: Record<string, unknown>) {
    return await update<Task>(CONFIG, id, input)
}

export async function deleteTask(id: string) {
    return await deleteEntity<Task>(CONFIG, id)
}
