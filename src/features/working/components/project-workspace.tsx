'use client'

import React, { useState } from 'react'
import { Project, Task, TaskStatus } from '@/features/working/types'
import { ProjectWorkspaceHeader } from './project-workspace-header'
import { TaskList } from './task-list'
import { KanbanView } from './kanban-view'
import { List, LayoutGrid, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createTask, updateTask, deleteTask } from '@/features/working/services/tasks'
import { EditTaskModal } from './edit-task-modal'
// import { toast } from 'sonner' // Removed missing dependency

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

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddTask = async (title: string) => {
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

    const handleStatusChange = async (id: string, status: TaskStatus) => {
        // Optimistic update
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
        <div>
            <ProjectWorkspaceHeader project={project} locale={locale} />

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#111114] border-[#1e1e24] focus:border-[#6366f1]/50 text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-[#111114] p-1 rounded-lg border border-[#1e1e24]">
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-[#1e1e24] text-[#6366f1]' : 'text-slate-500 hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setView('kanban')}
                            className={`p-2 rounded-md transition-all ${view === 'kanban' ? 'bg-[#1e1e24] text-[#6366f1]' : 'text-slate-500 hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                {view === 'list' ? (
                    <TaskList
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onAddTask={handleAddTask}
                    />
                ) : (
                    <KanbanView
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                    />
                )}

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
