import type { BaseEntity } from './base'

export interface Note extends BaseEntity {
    title: string
    content: string | null
    category_slug: string | null
    user_id: string
    tags: string[]
    is_published: boolean
}

export interface CreateNoteInput {
    title: string
    content?: string
    categorySlug?: string
    tags?: string[]
}

export interface UpdateNoteInput {
    title?: string
    content?: string
    categorySlug?: string | null
    tags?: string[]
}
