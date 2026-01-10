/**
 * Base interfaces for all entities in the system
 */

export interface BaseEntity {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface TaggableEntity {
  tags?: Tag[]
}

export interface Tag {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

/**
 * Generic CRUD operation types
 */
export type CreateInput<T> = Omit<T, keyof BaseEntity>
export type UpdateInput<T> = Partial<CreateInput<T>>

/**
 * API Response types
 */
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
