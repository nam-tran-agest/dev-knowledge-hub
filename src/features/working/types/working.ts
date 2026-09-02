import { BaseEntity } from '@/types/base';

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest';
export type IssueType = 'story' | 'task' | 'bug' | 'epic';
export type ProjectStatus = 'active' | 'archived';

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

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
    key?: string; // e.g. PRJ, DEV
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
    issue_type?: IssueType;
    story_points?: number | null;
    subtasks?: SubTask[];
    issue_key?: string; // e.g. DEV-101
}

export interface CreateProjectInput {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: ProjectStatus;
    order?: number;
    is_pinned?: boolean;
    key?: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    position?: number;
    issue_type?: IssueType;
    story_points?: number | null;
    subtasks?: SubTask[];
    issue_key?: string;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    status?: ProjectStatus;
    order?: number;
    is_pinned?: boolean;
    key?: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    project_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
    position?: number;
    issue_type?: IssueType;
    story_points?: number | null;
    subtasks?: SubTask[];
    issue_key?: string;
}

