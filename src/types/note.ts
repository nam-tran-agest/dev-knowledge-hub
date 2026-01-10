import type { BaseEntity, TaggableEntity, Tag, Category } from './base'

export type { Tag, Category }

export interface Note extends BaseEntity, TaggableEntity {
    category_id: string | null
    title: string
    content: string | null
    category?: Category | null
}

export interface CreateNoteInput {
    title: string
    content?: string
    categoryId?: string
    tagIds?: string[]
}

export interface UpdateNoteInput {
    title?: string
    content?: string
    categoryId?: string | null
    tagIds?: string[]
}
