'use server'

import { create, update, deleteEntity, getAll, getById } from '@/lib/actions/base-crud'
import { Project } from '@/features/working/types'
import { slugify } from '../utils/slug'

const CONFIG = {
    tableName: 'projects',
    revalidatePaths: ['/working']
}

export async function getProjects() {
    const { data } = await getAll<Project>(CONFIG)
    return data
}

export async function getProjectById(idOrSlug: string) {
    if (!idOrSlug) return null

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
    if (isUUID) {
        const project = await getById<Project>(CONFIG, idOrSlug)
        if (project) return project
    }

    // If not a UUID or UUID lookup didn't match, search user's projects by slug or name
    const { data: projects } = await getAll<Project>(CONFIG)
    if (!projects || projects.length === 0) return null

    // 1. Check explicit slug column
    const bySlug = projects.find(p => p.slug && p.slug.toLowerCase() === idOrSlug.toLowerCase())
    if (bySlug) return bySlug

    // 2. Check generated slug from name
    const bySlugifiedName = projects.find(p => slugify(p.name) === idOrSlug.toLowerCase())
    if (bySlugifiedName) return bySlugifiedName

    // 3. Check exact name (case-insensitive)
    const byName = projects.find(p => p.name.toLowerCase() === idOrSlug.toLowerCase())
    if (byName) return byName

    // 4. Fallback check by id
    return projects.find(p => p.id === idOrSlug) || null
}

export async function createProject(input: Record<string, unknown>) {
    const payload = { ...input }
    if (payload.name && !payload.slug) {
        payload.slug = slugify(String(payload.name))
    }

    try {
        return await create<Project>(CONFIG, payload)
    } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        // If DB doesn't have slug column yet, fallback gracefully without slug
        if (errorMsg.includes('slug') || errorMsg.includes('column') || errorMsg.includes('does not exist')) {
            const { slug: _slug, ...coreInput } = payload
            const created = await create<Project>(CONFIG, coreInput)
            return {
                ...created,
                slug: payload.slug as string
            } as Project
        }
        throw error
    }
}

export async function updateProject(id: string, input: Record<string, unknown>) {
    const payload = { ...input }
    if (payload.name && !payload.slug) {
        payload.slug = slugify(String(payload.name))
    }

    try {
        return await update<Project>(CONFIG, id, payload)
    } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        // If DB doesn't have slug column yet, fallback gracefully without slug
        if (errorMsg.includes('slug') || errorMsg.includes('column') || errorMsg.includes('does not exist')) {
            const { slug: _slug, ...coreInput } = payload
            const updated = await update<Project>(CONFIG, id, coreInput)
            return {
                ...updated,
                slug: payload.slug as string
            } as Project
        }
        throw error
    }
}

export async function deleteProject(id: string) {
    return await deleteEntity<Project>(CONFIG, id)
}
