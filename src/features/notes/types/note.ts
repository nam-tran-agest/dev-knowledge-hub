import type { BaseEntity } from '@/types/base'

export interface Note extends BaseEntity {
    title: string
    content: string | null
    category_slug: string | null
    user_id: string
    tags: string[]
    category?: {
        name: string
        color: string
        icon: string
        slug: string
    }
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
