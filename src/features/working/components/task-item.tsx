'use client'

import React from 'react'
import { Task, TaskStatus, IssueType, TaskPriority } from '@/features/working/types'
import { Card, CardContent } from '@/components/ui/card'
import {
    Circle,
    CheckCircle2,
    Clock,
    MoreVertical,
    Edit2,
    Trash2,
    GripVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Draggable } from '@hello-pangea/dnd'
import { cn } from "@/lib/utils"
import { 
    IssueTypeBadge, 
    PriorityBadge, 
    StoryPointsBadge, 
    SubtasksProgressIndicator, 
    IssueKeyBadge 
} from './task-badges'

interface TaskItemProps {
    task: Task
    index?: number
    onStatusChange?: (id: string, status: TaskStatus) => void
    onTypeChange?: (id: string, type: IssueType) => void
    onPriorityChange?: (id: string, priority: TaskPriority) => void
    onDelete?: (id: string) => void
    onEdit?: (task: Task) => void
    isDragDisabled?: boolean
}

export function TaskItem({ 
    task, 
    index, 
    onStatusChange, 
    onTypeChange,
    onPriorityChange,
    onDelete, 
    onEdit,
    isDragDisabled = false
}: TaskItemProps) {
    const isDone = task.status === 'done'
    const displayKey = task.issue_key || `TASK-${task.id.slice(0, 4).toUpperCase()}`
    
    // Calculate subtasks stats
    const totalSubtasks = task.subtasks?.length || 0
    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0

    // Check if due date is overdue
    const isOverdue = task.due_date && !isDone && new Date(task.due_date).getTime() < Date.now()

    const renderCardContent = (dragHandleProps?: Record<string, unknown>, isDragging?: boolean) => (
        <Card className={cn(
            "group relative bg-[#040712]/90 border-primary/20 hover:border-primary/60 transition-all duration-300 overflow-hidden cyber-clip-button font-mono shadow-sm",
            isDone && "opacity-50 grayscale hover:opacity-80 hover:grayscale-0",
            isDragging && "shadow-[0_0_25px_var(--color-primary)] border-primary rotate-1 scale-[1.02] z-50 bg-surface-deep/95"
        )}>
            {/* Top neon accent line */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-300",
                task.issue_type === 'bug' ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" :
                task.issue_type === 'story' ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" :
                task.issue_type === 'epic' ? "bg-purple-500 shadow-[0_0_8px_#a855f7]" :
                "bg-primary/40 group-hover:bg-primary"
            )} />

            <CardContent className="p-3.5 relative z-10 space-y-2.5">
                {/* Header: Issue Key + Drag Handle + Issue Type + Actions */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Drag Handle Grip */}
                        <div 
                            {...dragHandleProps} 
                            className="text-primary/30 hover:text-primary transition-colors cursor-grab active:cursor-grabbing p-0.5"
                            title="Drag to reorder"
                        >
                            <GripVertical size={13} />
                        </div>

                        <IssueKeyBadge issueKey={displayKey} />
                        
                        {/* Quick Interactive Issue Type Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    type="button" 
                                    className="cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                                    title="Nhấn để đổi loại công việc (Story / Task / Bug / Epic)"
                                >
                                    <IssueTypeBadge type={task.issue_type || 'task'} size="sm" showLabel={false} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40 font-mono">
                                <DropdownMenuItem 
                                    onClick={() => onTypeChange?.(task.id, 'task')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <IssueTypeBadge type="task" size="sm" />
                                    <span>Task</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onTypeChange?.(task.id, 'story')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <IssueTypeBadge type="story" size="sm" />
                                    <span>Story</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onTypeChange?.(task.id, 'bug')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <IssueTypeBadge type="bug" size="sm" />
                                    <span>Bug</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onTypeChange?.(task.id, 'epic')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <IssueTypeBadge type="epic" size="sm" />
                                    <span>Epic</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {/* Quick Interactive Priority Switcher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    type="button" 
                                    className="cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                                    title="Nhấn để đổi mức độ ưu tiên"
                                >
                                    <PriorityBadge priority={task.priority} showLabel={false} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 font-mono">
                                <DropdownMenuItem 
                                    onClick={() => onPriorityChange?.(task.id, 'highest')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <PriorityBadge priority="highest" showLabel />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onPriorityChange?.(task.id, 'high')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <PriorityBadge priority="high" showLabel />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onPriorityChange?.(task.id, 'medium')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <PriorityBadge priority="medium" showLabel />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onPriorityChange?.(task.id, 'low')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <PriorityBadge priority="low" showLabel />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => onPriorityChange?.(task.id, 'lowest')} 
                                    className="gap-2 text-xs uppercase cursor-pointer"
                                >
                                    <PriorityBadge priority="lowest" showLabel />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <StoryPointsBadge points={task.story_points} />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-primary/50 hover:text-white hover:bg-primary/20 transition-all cyber-clip-button border border-transparent hover:border-primary/30 cursor-pointer"
                                >
                                    <MoreVertical size={11} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 font-mono">
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(task)}
                                    className="gap-2 cursor-pointer text-xs uppercase"
                                >
                                    <Edit2 size={12} className="text-primary" /> [ CHỈNH SỬA TASK ]
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete?.(task.id)}
                                    className="gap-2 text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer text-xs uppercase"
                                >
                                    <Trash2 size={12} /> [ XOÁ TASK ]
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Task Title with Quick Toggle Checkbox */}
                <div className="flex items-start gap-2.5 pt-0.5">
                    <button
                        type="button"
                        onClick={() => onStatusChange?.(task.id, isDone ? 'todo' : 'done')}
                        className={cn(
                            "mt-0.5 text-primary/40 hover:text-primary transition-colors cursor-pointer shrink-0",
                            isDone && "text-emerald-400"
                        )}
                        title={isDone ? "Mark as Incomplete" : "Mark as Done"}
                    >
                        {isDone ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} />}
                    </button>

                    <h4 
                        onClick={() => onEdit?.(task)}
                        className={cn(
                            "text-xs font-bold text-white/95 hover:text-primary transition-colors leading-snug cursor-pointer select-none line-clamp-2",
                            isDone && "line-through text-primary/40"
                        )}
                    >
                        {task.title}
                    </h4>
                </div>

                {/* Optional Description preview */}
                {task.description && (
                    <p 
                        onClick={() => onEdit?.(task)}
                        className="text-[10.5px] text-primary/60 line-clamp-2 leading-relaxed pl-6 cursor-pointer"
                    >
                        {task.description}
                    </p>
                )}

                {/* Footer: Subtasks Progress + Due Date + Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-primary/10 pl-6">
                    {/* Subtasks Progress */}
                    {totalSubtasks > 0 && (
                        <SubtasksProgressIndicator completed={completedSubtasks} total={totalSubtasks} />
                    )}

                    {/* Due Date Indicator */}
                    {task.due_date && (
                        <div className={cn(
                            "flex items-center gap-1 text-[10px]",
                            isOverdue ? "text-rose-400 font-bold animate-pulse" : "text-primary/60"
                        )}>
                            <Clock size={11} className={isOverdue ? "text-rose-400" : "text-primary/50"} />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 ml-auto">
                            {task.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[8.5px] font-mono bg-primary/10 border border-primary/25 text-primary/80 px-1.5 py-0.2 cyber-clip-tag">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    if (index !== undefined) {
        return (
            <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="transition-transform"
                    >
                        {renderCardContent(provided.dragHandleProps as unknown as Record<string, unknown>, snapshot.isDragging)}
                    </div>
                )}
            </Draggable>
        )
    }

    return renderCardContent()
}
