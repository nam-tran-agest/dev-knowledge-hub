import { BaseEntity } from '@/types/base';

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'archived';

export interface Project extends BaseEntity {
    id: string; // Override to be specific
    user_id: string;
    name: string;
    description: string | null;
    color: string;
    icon: string;
    status: ProjectStatus;
    order: number;
    is_pinned: boolean;
}

export interface Task extends BaseEntity {
    id: string; // Override to be specific
    user_id: string;
    project_id: string | null;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    position: number;
    tags?: string[];
}

export interface CreateProjectInput {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: ProjectStatus;
    order?: number;
    is_pinned?: boolean;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    position?: number;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: ProjectStatus;
    order?: number;
    is_pinned?: boolean;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    position?: number;
}

