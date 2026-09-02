'use client'

import React, { useState } from 'react'
import { Project, Task, TaskStatus, IssueType, TaskPriority } from '@/features/working/types'
import { ProjectWorkspaceHeader } from './project-workspace-header'
import { TaskList } from './task-list'
import { KanbanView } from './kanban-view'
import { List, LayoutGrid, Search, Plus, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createTask, updateTask, deleteTask } from '@/features/working/services/tasks'
import { EditTaskModal } from './edit-task-modal'
import { CreateTaskModal } from './create-task-modal'
import { DropResult } from '@hello-pangea/dnd'
import { IssueTypeBadge, PriorityBadge } from './task-badges'
import { cn } from '@/lib/utils'

interface ProjectWorkspaceProps {
    project: Project
    initialTasks: Task[]
    locale: string
}

export function ProjectWorkspace({ project, initialTasks, locale }: ProjectWorkspaceProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [view, setView] = useState<'kanban' | 'list'>('kanban')
    const [searchQuery, setSearchQuery] = useState('')
    
    // Quick Filters
    const [selectedType, setSelectedType] = useState<IssueType | 'all'>('all')
    const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all')
    const [showOnlyOverdue, setShowOnlyOverdue] = useState(false)

    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createDefaultStatus, setCreateDefaultStatus] = useState<TaskStatus>('todo')

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        // Search query
        const matchesSearch = !searchQuery || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

        // Type filter
        const matchesType = selectedType === 'all' || (task.issue_type || 'task') === selectedType

        // Priority filter
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority

        // Overdue filter
        const matchesOverdue = !showOnlyOverdue || (
            task.due_date && 
            task.status !== 'done' && 
            new Date(task.due_date).getTime() < Date.now()
        )

        return matchesSearch && matchesType && matchesPriority && matchesOverdue
    })

    // Total story points across all filtered tasks
    const totalStoryPoints = filteredTasks.reduce((sum, t) => sum + (t.story_points || 0), 0)

    const handleQuickAddTask = async (title: string) => {
        try {
            const newTask = await createTask({
                title,
                project_id: project.id,
                status: 'todo',
                priority: 'medium',
                issue_type: 'task'
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

    // Interactive Drag and Drop Reordering & Column Transition
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result

        if (!destination) return

        // If dropped in the exact same place
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        const destStatus = destination.droppableId as TaskStatus

        // Clone current tasks
        const updatedTasks = [...tasks]
        const targetTaskIndex = updatedTasks.findIndex(t => t.id === draggableId)
        if (targetTaskIndex === -1) return

        const targetTask = { ...updatedTasks[targetTaskIndex] }

        // Remove from list
        updatedTasks.splice(targetTaskIndex, 1)

        // Update task status and position
        targetTask.status = destStatus
        targetTask.position = destination.index

        // Re-insert into new location in tasks array
        updatedTasks.splice(destination.index, 0, targetTask)

        // Optimistically update client state immediately
        setTasks(updatedTasks)

        // Sync change to server asynchronously in background without blocking UI
        updateTask(draggableId, {
            status: destStatus,
            position: destination.index
        }).catch(err => {
            console.error('Failed to persist dragged task state:', err)
        })
    }

    const hasActiveFilters = selectedType !== 'all' || selectedPriority !== 'all' || showOnlyOverdue

    const clearAllFilters = () => {
        setSelectedType('all')
        setSelectedPriority('all')
        setShowOnlyOverdue(false)
        setSearchQuery('')
    }

    return (
        <div className="min-h-screen pb-16 font-mono">
            <ProjectWorkspaceHeader project={project} locale={locale} />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                {/* JIRA Command & Search Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={15} />
                        <Input
                            placeholder="SEARCH_ISSUES_OR_#TAGS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-surface-deep/90 border-primary/30 focus:border-primary text-white font-mono text-xs h-9 cyber-clip-button"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Story Points Total Board Counter */}
                        {totalStoryPoints > 0 && (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-xs">
                                <span className="text-primary/60">◈ TOTAL_SP:</span>
                                <span className="text-primary font-bold">{totalStoryPoints}</span>
                            </div>
                        )}

                        {/* Primary Create Task Button */}
                        <button
                            type="button"
                            onClick={() => handleOpenCreateModal('todo')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 cyber-clip-button bg-primary text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-primary)] h-9"
                        >
                            <Plus size={14} className="stroke-[3]" />
                            <span>[ + NEW ISSUE ]</span>
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 bg-surface p-1 cyber-clip-button border border-primary/30 h-9">
                            <button
                                type="button"
                                onClick={() => setView('kanban')}
                                className={cn(
                                    "px-2.5 py-1 cyber-clip-button transition-all text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5",
                                    view === 'kanban' ? 'bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]' : 'text-primary/60 hover:text-white'
                                )}
                            >
                                <LayoutGrid size={13} />
                                <span className="hidden sm:inline">KANBAN</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className={cn(
                                    "px-2.5 py-1 cyber-clip-button transition-all text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5",
                                    view === 'list' ? 'bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]' : 'text-primary/60 hover:text-white'
                                )}
                            >
                                <List size={13} />
                                <span className="hidden sm:inline">LIST</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* JIRA Agile Quick Filters Toolbar */}
                <div className="flex flex-wrap items-center gap-2 mb-6 pb-3 border-b border-primary/15 text-xs select-none">
                    <span className="text-[10px] text-primary/50 uppercase tracking-widest flex items-center gap-1 mr-1">
                        <Filter className="w-3 h-3 text-primary/60" />
                        FILTERS:
                    </span>

                    {/* Issue Type Quick Filters */}
                    <button
                        type="button"
                        onClick={() => setSelectedType('all')}
                        className={cn(
                            "px-2 py-0.5 cyber-clip-tag border text-[10px] uppercase font-bold transition-all cursor-pointer",
                            selectedType === 'all' 
                                ? "bg-primary/25 border-primary text-primary shadow-[0_0_8px_var(--color-primary)]" 
                                : "bg-primary/5 border-primary/20 text-primary/60 hover:text-white hover:border-primary/40"
                        )}
                    >
                        ALL TYPES
                    </button>

                    {(['story', 'task', 'bug', 'epic'] as IssueType[]).map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType((prev: IssueType | 'all') => prev === type ? 'all' : type)}
                            className={cn(
                                "cursor-pointer transition-all",
                                selectedType === type ? "scale-105" : "opacity-70 hover:opacity-100"
                            )}
                        >
                            <IssueTypeBadge type={type} size="sm" />
                        </button>
                    ))}

                    <div className="w-[1px] h-4 bg-primary/20 mx-1 hidden sm:block" />

                    {/* Priority Quick Filters */}
                    {(['highest', 'high', 'medium'] as TaskPriority[]).map(pri => (
                        <button
                            key={pri}
                            type="button"
                            onClick={() => setSelectedPriority((prev: TaskPriority | 'all') => prev === pri ? 'all' : pri)}
                            className={cn(
                                "cursor-pointer transition-all",
                                selectedPriority === pri ? "scale-105" : "opacity-70 hover:opacity-100"
                            )}
                        >
                            <PriorityBadge priority={pri} showLabel />
                        </button>
                    ))}

                    {/* Overdue Filter */}
                    <button
                        type="button"
                        onClick={() => setShowOnlyOverdue(prev => !prev)}
                        className={cn(
                            "px-2 py-0.5 cyber-clip-tag border text-[10px] uppercase font-bold transition-all cursor-pointer",
                            showOnlyOverdue 
                                ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse" 
                                : "bg-rose-500/5 border-rose-500/20 text-rose-400/60 hover:text-rose-400 hover:border-rose-500/40"
                        )}
                    >
                        OVERDUE ONLY
                    </button>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 text-[10px] text-destructive hover:text-rose-300 transition-colors ml-auto cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                            <span>RESET_FILTERS</span>
                        </button>
                    )}
                </div>

                {/* Workspace Views */}
                {view === 'kanban' ? (
                    <KanbanView
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onOpenCreateModal={handleOpenCreateModal}
                        onDragEnd={handleDragEnd}
                    />
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onAddTask={handleQuickAddTask}
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

                {/* Edit Task Modal / JIRA Issue Drawer */}
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
