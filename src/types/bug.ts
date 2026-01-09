import type { Tag } from './note'

export interface Bug {
    id: string
    user_id: string
    title: string
    error_message: string | null
    stack_trace: string | null
    root_cause: string | null
    solution: string | null
    resolved: boolean
    created_at: string
    updated_at: string
    tags?: Tag[]
}

export interface CreateBugInput {
    title: string
    error_message?: string
    stack_trace?: string
    root_cause?: string
    solution?: string
    resolved?: boolean
    tagIds?: string[]
}

export interface UpdateBugInput {
    title?: string
    error_message?: string
    stack_trace?: string
    root_cause?: string
    solution?: string
    resolved?: boolean
    tagIds?: string[]
}
