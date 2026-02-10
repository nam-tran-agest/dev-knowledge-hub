'use client'

import React from 'react'
import { Task, TaskStatus } from '@/types/working'
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
            "group relative bg-[#111114] border-[#1e1e24] hover:border-[#6366f1]/30 transition-all duration-300 overflow-hidden",
            isDone && "opacity-60"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => onStatusChange?.(task.id, isDone ? 'todo' : 'done')}
                        className={cn(
                            "mt-1 text-slate-500 hover:text-[#6366f1] transition-colors",
                            isDone && "text-[#6366f1]"
                        )}
                    >
                        {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>

                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "text-base font-medium text-white transition-colors",
                                isDone && "line-through text-slate-500"
                            )}>
                                {task.title}
                            </h3>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-[10px] h-5 px-1.5",
                                    task.priority === 'high' && "text-red-400 border-red-500/20 bg-red-500/5",
                                    task.priority === 'medium' && "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
                                    task.priority === 'low' && "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
                                )}
                            >
                                {task.priority}
                            </Badge>
                        </div>

                        {task.description && (
                            <p className="text-sm text-slate-400 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 pt-2">
                            {task.due_date && (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Clock size={12} />
                                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                    {task.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-[#1e1e24] text-slate-400 px-1.5 py-0.5 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#16161a] border-[#2a2a30] text-slate-200">
                            <DropdownMenuItem
                                onClick={() => onEdit?.(task)}
                                className="gap-2 focus:bg-white/5 focus:text-white cursor-pointer"
                            >
                                <Edit2 size={14} /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(task.id)}
                                className="gap-2 text-red-400 focus:bg-red-500/5 focus:text-red-400 cursor-pointer"
                            >
                                <Trash2 size={14} /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
