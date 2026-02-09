'use server'

import { create, update, deleteEntity, getAll, getById } from './base-crud'
import { Task } from '@/types/working'

const CONFIG = {
    tableName: 'tasks',
    tagJunctionTable: 'task_tags',
    tagColumn: 'task_id',
    revalidatePaths: ['/working', '/[locale]/working']
}

export async function getTasks(projectId?: string) {
    const filters: Record<string, any> = {}
    if (projectId) {
        filters.project_id = projectId
    }

    const { data } = await getAll<Task>(CONFIG, { filters })
    return data
}

export async function getTaskById(id: string) {
    return await getById<Task>(CONFIG, id)
}

export async function createTask(input: Record<string, any>) {
    return await create<Task>(CONFIG, input)
}

export async function updateTask(id: string, input: Record<string, any>) {
    return await update<Task>(CONFIG, id, input)
}

export async function deleteTask(id: string) {
    return await deleteEntity<Task>(CONFIG, id)
}
