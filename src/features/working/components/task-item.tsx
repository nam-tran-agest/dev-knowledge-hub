'use client'

import React from 'react'
import { Task, TaskStatus } from '@/features/working/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Circle,
    CheckCircle2,
    Clock,
    MoreVertical,
    Edit2,
    Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TaskItemProps {
    task: Task
    onStatusChange?: (id: string, status: TaskStatus) => void
    onDelete?: (id: string) => void
    onEdit?: (task: Task) => void
}

export function TaskItem({ task, onStatusChange, onDelete, onEdit }: TaskItemProps) {
    const isDone = task.status === 'done'

    return (
        <Card className={cn(
            "group relative bg-[#040712]/80 border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden cyber-clip-button font-mono",
            isDone && "opacity-40 grayscale"
        )}>
            <CardContent className="p-3.5 relative z-10">
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => onStatusChange?.(task.id, isDone ? 'todo' : 'done')}
                        className={cn(
                            "mt-0.5 text-primary/50 hover:text-primary transition-colors cursor-pointer",
                            isDone && "text-primary"
                        )}
                    >
                        {isDone ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
                    </button>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "text-xs font-bold text-white transition-colors uppercase tracking-wide",
                                isDone && "line-through text-primary/40"
                            )}>
                                {task.title}
                            </h3>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[9px] font-mono h-4 px-1.5 uppercase",
                                    task.priority === 'high' && "text-destructive border-destructive/30 bg-destructive/10",
                                    task.priority === 'medium' && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                                    task.priority === 'low' && "text-primary border-primary/30 bg-primary/10",
                                )}
                            >
                                {task.priority}
                            </Badge>
                        </div>

                        {task.description && (
                            <p className="text-[11px] text-primary/60 line-clamp-2 leading-relaxed">
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 pt-1">
                            {task.due_date && (
                                <div className="flex items-center gap-1 text-[10px] text-primary/50">
                                    <Clock size={11} />
                                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {task.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-mono bg-primary/10 border border-primary/30 text-primary px-1.5 py-0.2 cyber-clip-tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/60 hover:text-white hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity cyber-clip-button border border-primary/20 cursor-pointer">
                                <MoreVertical size={12} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => onEdit?.(task)}
                                className="gap-2 cursor-pointer text-xs uppercase"
                            >
                                <Edit2 size={12} /> [ EDIT_PARAM ]
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(task.id)}
                                className="gap-2 text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer text-xs uppercase"
                            >
                                <Trash2 size={12} /> [ PURGE_TASK ]
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
