import type { Tag } from './note'

export type SnippetType = 'code' | 'prompt'

export interface Snippet {
    id: string
    user_id: string
    title: string
    content: string
    language: string
    type: SnippetType
    description: string | null
    created_at: string
    updated_at: string
    tags?: Tag[]
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
