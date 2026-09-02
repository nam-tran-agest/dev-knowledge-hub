'use client'

import React from 'react'
import { Task, TaskStatus } from '@/features/working/types'
import { TaskItem } from './task-item'
import { useTranslations } from 'next-intl'
import { 
    Plus, 
    Inbox, 
    Clock, 
    Activity, 
    Eye, 
    CheckCircle2, 
    Sparkles 
} from 'lucide-react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

interface KanbanViewProps {
    tasks: Task[]
    onStatusChange?: (id: string, status: TaskStatus) => void
    onDelete?: (id: string) => void
    onEdit?: (task: Task) => void
    onOpenCreateModal?: (status: TaskStatus) => void
    onDragEnd?: (result: DropResult) => void
}

export function KanbanView({ 
    tasks, 
    onStatusChange, 
    onDelete, 
    onEdit, 
    onOpenCreateModal,
    onDragEnd 
}: KanbanViewProps) {
    const t = useTranslations('navigation.tasks.columns')
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const COLUMNS: { 
        id: TaskStatus; 
        title: string; 
        icon: React.ElementType; 
        color: string; 
        border: string;
        glow: string;
        accentText: string;
    }[] = [
        { 
            id: 'backlog', 
            title: t('backlog') || 'BACKLOG', 
            icon: Inbox,
            color: '#64748b', 
            border: 'border-slate-500/30 group-hover:border-slate-400/50', 
            glow: 'shadow-[0_0_12px_rgba(100,116,139,0.35)]',
            accentText: 'text-slate-400'
        },
        { 
            id: 'todo', 
            title: t('todo') || 'TO DO', 
            icon: Clock,
            color: '#06b6d4', 
            border: 'border-cyan-500/30 group-hover:border-cyan-400/50', 
            glow: 'shadow-[0_0_12px_rgba(6,182,212,0.35)]',
            accentText: 'text-cyan-400'
        },
        { 
            id: 'doing', 
            title: t('doing') || 'IN PROGRESS', 
            icon: Activity,
            color: '#818cf8', 
            border: 'border-indigo-500/30 group-hover:border-indigo-400/50', 
            glow: 'shadow-[0_0_15px_rgba(129,140,248,0.45)]',
            accentText: 'text-indigo-400'
        },
        { 
            id: 'review', 
            title: t('review') || 'IN REVIEW', 
            icon: Eye,
            color: '#f59e0b', 
            border: 'border-amber-500/30 group-hover:border-amber-400/50', 
            glow: 'shadow-[0_0_15px_rgba(245,158,11,0.45)]',
            accentText: 'text-amber-400'
        },
        { 
            id: 'done', 
            title: t('done') || 'DONE', 
            icon: CheckCircle2,
            color: '#10b981', 
            border: 'border-emerald-500/30 group-hover:border-emerald-400/50', 
            glow: 'shadow-[0_0_15px_rgba(168,85,247,0.45)]',
            accentText: 'text-emerald-400'
        },
    ]

    const handleDragEndInternal = (result: DropResult) => {
        if (onDragEnd) {
            onDragEnd(result)
        }
    }

    if (!isMounted) {
        return (
            <div className="flex gap-4.5 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[calc(100vh-280px)] select-none">
                {COLUMNS.map((column) => {
                    const columnTasks = tasks.filter(t => t.status === column.id)
                    const Icon = column.icon
                    const totalPoints = columnTasks.reduce((sum, task) => sum + (task.story_points || 0), 0)

                    return (
                        <div
                            key={column.id}
                            className={cn(
                                "flex-1 flex flex-col min-w-[290px] max-w-[340px] cyber-panel p-4 sm:p-4.5 relative group border transition-all duration-300",
                                column.border,
                                "bg-[#04060f]/90 backdrop-blur-md"
                            )}
                        >
                            <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3 border-b border-primary/15">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div 
                                        className={cn("w-6 h-6 flex items-center justify-center cyber-clip-tag border", column.glow)}
                                        style={{ backgroundColor: `${column.color}15`, borderColor: `${column.color}50` }}
                                    >
                                        <Icon className={cn("w-3.5 h-3.5", column.accentText)} />
                                    </div>
                                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white truncate">
                                        {column.title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                                    <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/30 text-primary font-bold cyber-clip-tag">
                                        {columnTasks.length}
                                    </span>
                                    {totalPoints > 0 && (
                                        <span className="px-1.5 py-0.5 bg-surface-deep border border-primary/20 text-primary/70 font-semibold cyber-clip-tag">
                                            {totalPoints} SP
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="relative z-10 flex-1 space-y-2.5 min-h-[140px] p-1">
                                {columnTasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onStatusChange={onStatusChange}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        isDragDisabled={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <DragDropContext onDragEnd={handleDragEndInternal}>
            <div className="flex gap-4.5 overflow-x-auto pb-6 pt-2 custom-scrollbar min-h-[calc(100vh-280px)] select-none">
                {COLUMNS.map((column) => {
                    const columnTasks = tasks.filter(t => t.status === column.id)
                    const Icon = column.icon

                    // Calculate total story points in column
                    const totalPoints = columnTasks.reduce((sum, task) => sum + (task.story_points || 0), 0)

                    return (
                        <div
                            key={column.id}
                            className={cn(
                                "flex-1 flex flex-col min-w-[290px] max-w-[340px] cyber-panel p-4 sm:p-4.5 relative group border transition-all duration-300",
                                column.border,
                                "bg-[#04060f]/90 backdrop-blur-md"
                            )}
                        >
                            {/* Cyberpunk Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff03_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />

                            {/* Column Header */}
                            <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3 border-b border-primary/15">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div 
                                        className={cn("w-6 h-6 flex items-center justify-center cyber-clip-tag border", column.glow)}
                                        style={{ backgroundColor: `${column.color}15`, borderColor: `${column.color}50` }}
                                    >
                                        <Icon className={cn("w-3.5 h-3.5", column.accentText)} />
                                    </div>

                                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white truncate">
                                        {column.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                                    {/* Task Count Badge */}
                                    <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/30 text-primary font-bold cyber-clip-tag">
                                        {columnTasks.length}
                                    </span>

                                    {/* Column Story Points Sum */}
                                    {totalPoints > 0 && (
                                        <span 
                                            className="px-1.5 py-0.5 bg-surface-deep border border-primary/20 text-primary/70 font-semibold cyber-clip-tag"
                                            title={`Total Story Points in ${column.title}: ${totalPoints}`}
                                        >
                                            {totalPoints} SP
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Droppable Task List Container */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={cn(
                                            "relative z-10 flex-1 space-y-2.5 min-h-[140px] transition-colors p-1 rounded-sm",
                                            snapshot.isDraggingOver && "bg-primary/5 border border-dashed border-primary/40"
                                        )}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <TaskItem
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                onStatusChange={onStatusChange}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                            />
                                        ))}

                                        {provided.placeholder}

                                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                                            <div className="h-24 border border-dashed border-primary/15 bg-primary/2 cyber-clip-button flex flex-col items-center justify-center text-primary/30 text-[10px] font-mono uppercase tracking-widest gap-1 my-2 select-none">
                                                <Sparkles className="w-3.5 h-3.5 text-primary/20" />
                                                <span>[ NO_ACTIVE_DATA ]</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>

                            {/* Add Task Button at bottom of column */}
                            {onOpenCreateModal && (
                                <button
                                    type="button"
                                    onClick={() => onOpenCreateModal(column.id)}
                                    className="relative z-10 w-full py-2 mt-3 cyber-clip-button border border-dashed border-primary/25 hover:border-primary/60 bg-primary/5 hover:bg-primary/15 text-primary/80 hover:text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>[ + ISSUE ]</span>
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}
