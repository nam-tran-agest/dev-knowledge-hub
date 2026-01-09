export type TaskStatus = 'todo' | 'doing' | 'done'

export interface Task {
    id: string
    user_id: string
    title: string
    description: string | null
    status: TaskStatus
    deadline: string | null
    position: number
    created_at: string
    updated_at: string
    linked_notes?: { id: string; title: string }[]
    linked_snippets?: { id: string; title: string }[]
}

export interface CreateTaskInput {
    title: string
    description?: string
    status?: TaskStatus
    deadline?: string
    noteIds?: string[]
    snippetIds?: string[]
}

export interface UpdateTaskInput {
    title?: string
    description?: string
    status?: TaskStatus
    deadline?: string | null
    position?: number
    noteIds?: string[]
    snippetIds?: string[]
}

export interface TaskColumn {
    id: TaskStatus
    title: string
    tasks: Task[]
}
