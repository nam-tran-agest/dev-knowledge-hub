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
            const res = await createTask({
                title,
                project_id: project.id,
                status: 'todo',
                priority: 'medium',
                issue_type: 'task'
            })
            if (res && !('error' in res)) {
                setTasks(prev => [res as Task, ...prev])
            }
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

        const sourceStatus = source.droppableId as TaskStatus
        const destStatus = destination.droppableId as TaskStatus

        // Find target task
        const targetTask = tasks.find(t => t.id === draggableId)
        if (!targetTask) return

        const sortByPosition = (left: Task, right: Task) => left.position - right.position
        const sourceTasks = tasks
            .filter(task => task.id !== draggableId && task.status === sourceStatus)
            .sort(sortByPosition)
        const destTasks = (sourceStatus === destStatus
            ? sourceTasks
            : tasks.filter(task => task.id !== draggableId && task.status === destStatus).sort(sortByPosition)
        )

        const updatedTarget = {
            ...targetTask,
            status: destStatus,
        }

        // Determine precise insertion point (accounting for active filters if any)
        const filteredDestTasks = filteredTasks
            .filter(task => task.id !== draggableId && task.status === destStatus)
            .sort(sortByPosition)
        const referenceTask = filteredDestTasks[destination.index]

        let insertIdx = destTasks.length
        if (referenceTask) {
            const foundIdx = destTasks.findIndex(t => t.id === referenceTask.id)
            if (foundIdx !== -1) insertIdx = foundIdx
        } else if (destination.index === 0) {
            insertIdx = 0
        }

        destTasks.splice(insertIdx, 0, updatedTarget)

        const changedTasks = new Map<string, Task>()
        const normalizeColumn = (columnTasks: Task[], status: TaskStatus) => {
            columnTasks.forEach((task, position) => {
                changedTasks.set(task.id, { ...task, status, position })
            })
        }

        normalizeColumn(destTasks, destStatus)
        if (sourceStatus !== destStatus) {
            normalizeColumn(sourceTasks, sourceStatus)
        }

        const tasksToPersist = [...changedTasks.values()].filter(task => {
            const previous = tasks.find(current => current.id === task.id)
            return previous && (previous.status !== task.status || previous.position !== task.position)
        })

        setTasks(previous => previous.map(task => changedTasks.get(task.id) || task))

        // Persist every shifted task so the board order survives a reload.
        Promise.all(tasksToPersist.map(task => updateTask(task.id, {
            status: task.status,
            position: task.position,
        }))).catch(err => {
            console.error('Failed to persist dragged task state:', err)
        })
    }

    // 1-Click Inline Type & Priority Switchers
    const handleTypeChange = (taskId: string, newType: IssueType) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, issue_type: newType } : t))
        updateTask(taskId, { issue_type: newType }).catch(err => {
            console.error('Failed to persist task type:', err)
        })
    }

    const handlePriorityChange = (taskId: string, newPriority: TaskPriority) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t))
        updateTask(taskId, { priority: newPriority }).catch(err => {
            console.error('Failed to persist task priority:', err)
        })
    }

    const hasActiveFilters = selectedType !== 'all' || selectedPriority !== 'all' || showOnlyOverdue || !!searchQuery.trim()

    const clearAllFilters = () => {
        setSelectedType('all')
        setSelectedPriority('all')
        setShowOnlyOverdue(false)
        setSearchQuery('')
    }

    return (
        <div className="min-h-screen pb-16 font-mono">
            <ProjectWorkspaceHeader project={project} locale={locale} />

            <main className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
                {/* Agile Command & Search Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={15} />
                        <Input
                            placeholder="SEARCH_TASKS_OR_#TAGS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-surface-deep/90 border-primary/30 focus:border-primary text-white font-mono text-xs h-9 cyber-clip-button"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Story Points Total Board Counter */}
                        {totalStoryPoints > 0 && (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-xs" title="Total project story points">
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
                            <span>[ + CREATE TASK ]</span>
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

                {/* Agile Quick Filters Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-2.5 bg-surface-deep/60 border border-primary/20 cyber-clip text-xs select-none">
                    {/* Header Label */}
                    <div className="flex items-center gap-1.5 text-primary/70 text-[11px] font-bold uppercase tracking-wider pr-2 border-r border-primary/20">
                        <Filter className="w-3.5 h-3.5 text-primary" />
                        <span>FILTERS</span>
                    </div>

                    {/* Group 1: Task Type */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-primary/40 uppercase">Task Type:</span>
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
                            ALL
                        </button>
                        {(['story', 'task', 'bug', 'epic'] as IssueType[]).map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedType((prev: IssueType | 'all') => prev === type ? 'all' : type)}
                                className={cn(
                                    "cursor-pointer transition-all",
                                    selectedType === type ? "scale-105 ring-1 ring-white/60" : "opacity-60 hover:opacity-100"
                                )}
                                title={`Show only ${type.toUpperCase()} tasks`}
                            >
                                <IssueTypeBadge type={type} size="sm" />
                            </button>
                        ))}
                    </div>

                    <div className="w-[1px] h-4 bg-primary/20 hidden md:block" />

                    {/* Group 2: Priority */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-primary/40 uppercase">Priority:</span>
                        <button
                            type="button"
                            onClick={() => setSelectedPriority('all')}
                            className={cn(
                                "px-2 py-0.5 cyber-clip-tag border text-[10px] uppercase font-bold transition-all cursor-pointer",
                                selectedPriority === 'all' 
                                    ? "bg-primary/25 border-primary text-primary shadow-[0_0_8px_var(--color-primary)]" 
                                    : "bg-primary/5 border-primary/20 text-primary/60 hover:text-white hover:border-primary/40"
                            )}
                        >
                            ALL
                        </button>
                        {(['highest', 'high', 'medium'] as TaskPriority[]).map(pri => (
                            <button
                                key={pri}
                                type="button"
                                onClick={() => setSelectedPriority((prev: TaskPriority | 'all') => prev === pri ? 'all' : pri)}
                                className={cn(
                                    "cursor-pointer transition-all",
                                    selectedPriority === pri ? "scale-105 ring-1 ring-white/60" : "opacity-60 hover:opacity-100"
                                )}
                                title={`Filter by ${pri.toUpperCase()} priority`}
                            >
                                <PriorityBadge priority={pri} showLabel />
                            </button>
                        ))}
                    </div>

                    <div className="w-[1px] h-4 bg-primary/20 hidden md:block" />

                    {/* Group 3: Overdue */}
                    <button
                        type="button"
                        onClick={() => setShowOnlyOverdue(prev => !prev)}
                        className={cn(
                            "px-2.5 py-0.5 cyber-clip-tag border text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1",
                            showOnlyOverdue 
                                ? "bg-rose-500/25 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)] animate-pulse" 
                                : "bg-rose-500/5 border-rose-500/20 text-rose-400/60 hover:text-rose-400 hover:border-rose-500/40"
                        )}
                        title="Show only overdue tasks"
                    >
                        <span>⚠️ OVERDUE</span>
                    </button>

                    {/* Results Counter & Reset Action */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-[10px] text-primary/60">
                                Showing <span className="text-white font-bold">{filteredTasks.length}</span>/{tasks.length}
                            </span>
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="flex items-center gap-1 text-[10px] text-destructive hover:text-rose-300 transition-colors cursor-pointer px-1.5 py-0.5 bg-destructive/10 border border-destructive/30 cyber-clip-tag"
                            >
                                <X className="w-3 h-3" />
                                <span>[ RESET ]</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Workspace Views */}
                {view === 'kanban' ? (
                    <KanbanView
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onTypeChange={handleTypeChange}
                        onPriorityChange={handlePriorityChange}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onOpenCreateModal={handleOpenCreateModal}
                        onDragEnd={handleDragEnd}
                    />
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        onStatusChange={handleStatusChange}
                        onTypeChange={handleTypeChange}
                        onPriorityChange={handlePriorityChange}
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
