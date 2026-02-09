import { BaseEntity } from './base';

export type TaskStatus = 'active' | 'paused' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task extends BaseEntity {
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    user_id: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
}
