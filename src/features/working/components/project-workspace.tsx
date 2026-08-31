'use client'

import React, { useState } from 'react'
import { Project, Task, TaskStatus } from '@/features/working/types'
import { ProjectWorkspaceHeader } from './project-workspace-header'
import { TaskList } from './task-list'
import { KanbanView } from './kanban-view'
import { List, LayoutGrid, Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createTask, updateTask, deleteTask } from '@/features/working/services/tasks'
import { EditTaskModal } from './edit-task-modal'
import { CreateTaskModal } from './create-task-modal'

interface ProjectWorkspaceProps {
    project: Project
    initialTasks: Task[]
    locale: string
}

export function ProjectWorkspace({ project, initialTasks, locale }: ProjectWorkspaceProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [view, setView] = useState<'list' | 'kanban'>('list')
    const [searchQuery, setSearchQuery] = useState('')
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createDefaultStatus, setCreateDefaultStatus] = useState<TaskStatus>('todo')

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleQuickAddTask = async (title: string) => {
        try {
            const newTask = await createTask({
                title,
                project_id: project.id,
                status: 'todo',
                priority: 'medium'
            })
            setTasks(prev => [newTask, ...prev])
        } catch (error) {
            console.error('Failed to create task:', error)
        }
    }

    const handleCreateSuccess = (newTask: Task) => {
        setTasks(prev => [newTask, ...prev])
    }

    const handleOpenCreateModal = (status: TaskStatus = 'todo') => {
        setCreateDefaultStatus(status)
        setIsCreateModalOpen(true)
    }

    const handleStatusChange = async (id: string, status: TaskStatus) => {
        const oldTasks = [...tasks]
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))

        try {
            await updateTask(id, { status })
        } catch (error) {
            setTasks(oldTasks)
            console.error('Failed to update task status:', error)
        }
    }

    const handleDeleteTask = async (id: string) => {
        const oldTasks = [...tasks]
        setTasks(prev => prev.filter(t => t.id !== id))

        try {
            await deleteTask(id)
        } catch (error) {
            setTasks(oldTasks)
            console.error('Failed to delete task:', error)
        }
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setIsEditModalOpen(true)
    }

    const handleEditSuccess = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
    }

    return (
        <div className="min-h-screen">
            <ProjectWorkspaceHeader project={project} locale={locale} />

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                        <Input
                            placeholder="SEARCH_TELEMETRY_TASKS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-surface-deep/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Primary Create Task Button */}
                        <button
                            onClick={() => handleOpenCreateModal('todo')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 cyber-clip-button bg-primary text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-primary)]"
                        >
                            <Plus size={15} className="stroke-[2.5]" />
                            <span>[ CREATE TASK ]</span>
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1.5 bg-surface p-1 cyber-clip-button border border-primary/30">
                            <button
                                onClick={() => setView('list')}
                                className={`px-3 py-1.5 cyber-clip-button transition-all text-xs font-mono uppercase tracking-wider cursor-pointer ${
                                    view === 'list' ? 'bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]' : 'text-primary/60 hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-1.5"><List size={14} /> LIST</span>
                            </button>
                            <button
                                onClick={() => setView('kanban')}
                                className={`px-3 py-1.5 cyber-clip-button transition-all text-xs font-mono uppercase tracking-wider cursor-pointer ${
                                    view === 'kanban' ? 'bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]' : 'text-primary/60 hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-1.5"><LayoutGrid size={14} /> KANBAN</span>
                            </button>
                        </div>
                    </div>
                </div>

                {view === 'list' ? (
                    <TaskList
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onAddTask={handleQuickAddTask}
                    />
                ) : (
                    <KanbanView
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onOpenCreateModal={handleOpenCreateModal}
                    />
                )}

                {/* Create Task Modal */}
                <CreateTaskModal
                    projectId={project.id}
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    defaultStatus={createDefaultStatus}
                    onSuccess={handleCreateSuccess}
                />

                {/* Edit Task Modal */}
                <EditTaskModal
                    task={editingTask}
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    onSuccess={handleEditSuccess}
                />
            </main>
        </div>
    )
}
