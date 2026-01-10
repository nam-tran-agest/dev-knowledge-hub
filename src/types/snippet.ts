import type { BaseEntity, TaggableEntity, Tag } from './base'

export type { Tag }
export type SnippetType = 'code' | 'prompt'

export interface Snippet extends BaseEntity, TaggableEntity {
    title: string
    content: string
    language: string
    type: SnippetType
    description: string | null
}

export interface CreateSnippetInput {
    title: string
    content: string
    language?: string
    type?: SnippetType
    description?: string
    tagIds?: string[]
}

export interface UpdateSnippetInput {
    title?: string
    content?: string
    language?: string
    type?: SnippetType
    description?: string
    tagIds?: string[]
}
