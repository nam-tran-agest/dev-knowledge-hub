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
            "group relative bg-card/40 border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden cyber-clip-button",
            isDone && "opacity-50 grayscale"
        )}>
            <CardContent className="p-4 relative z-10">
                <div className="flex items-start gap-3.5">
                    <button
                        onClick={() => onStatusChange?.(task.id, isDone ? 'todo' : 'done')}
                        className={cn(
                            "mt-0.5 text-primary/50 hover:text-primary transition-colors cursor-pointer",
                            isDone && "text-emerald-400"
                        )}
                    >
                        {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "text-sm font-semibold text-white transition-colors",
                                isDone && "line-through text-slate-500"
                            )}>
                                {task.title}
                            </h3>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] font-mono h-4 px-1.5",
                                    task.priority === 'high' && "text-rose-400 border-rose-500/30 bg-rose-500/10",
                                    task.priority === 'medium' && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                                    task.priority === 'low' && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                                )}
                            >
                                {task.priority}
                            </Badge>
                        </div>

                        {task.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 pt-1.5">
                            {task.due_date && (
                                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                                    <Clock size={12} />
                                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    {task.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-mono bg-white/[0.04] border border-white/5 text-slate-400 px-1.5 py-0.5 rounded-md">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer">
                                <MoreVertical size={14} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#07090e]/95 border-white/10 backdrop-blur-2xl text-slate-200 rounded-2xl">
                            <DropdownMenuItem
                                onClick={() => onEdit?.(task)}
                                className="gap-2 focus:bg-white/10 focus:text-white cursor-pointer text-xs"
                            >
                                <Edit2 size={13} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(task.id)}
                                className="gap-2 text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer text-xs"
                            >
                                <Trash2 size={13} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
