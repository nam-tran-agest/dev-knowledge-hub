export interface Category {
    id: string
    user_id: string
    name: string
    color: string
    created_at: string
}

export interface Tag {
    id: string
    user_id: string
    name: string
    created_at: string
}

export interface Note {
    id: string
    user_id: string
    category_id: string | null
    title: string
    content: string | null
    created_at: string
    updated_at: string
    category?: Category | null
    tags?: Tag[]
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
