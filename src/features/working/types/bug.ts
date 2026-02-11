import type { BaseEntity, TaggableEntity, Tag } from '@/types/base'

export type { Tag }

export interface Bug extends BaseEntity, TaggableEntity {
    title: string
    error_message: string | null
    stack_trace: string | null
    root_cause: string | null
    solution: string | null
    resolved: boolean
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
