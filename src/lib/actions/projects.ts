'use server'

import { create, update, deleteEntity, getAll, getById } from './base-crud'
import { Project } from '@/types/working'

const CONFIG = {
    tableName: 'projects',
    revalidatePaths: ['/working', '/[locale]/working']
}

export async function getProjects() {
    const { data } = await getAll<Project>(CONFIG)
    return data
}

export async function getProjectById(id: string) {
    return await getById<Project>(CONFIG, id)
}

export async function createProject(input: Record<string, unknown>) {
    return await create<Project>(CONFIG, input)
}

export async function updateProject(id: string, input: Record<string, unknown>) {
    return await update<Project>(CONFIG, id, input)
}

export async function deleteProject(id: string) {
    return await deleteEntity<Project>(CONFIG, id)
}
