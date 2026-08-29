'use client'

import React from 'react'
import { Task, TaskStatus } from '@/features/working/types'
import { TaskItem } from './task-item'
import { useTranslations } from 'next-intl'

interface KanbanViewProps {
    tasks: Task[]
    onStatusChange?: (id: string, status: TaskStatus) => void
    onDelete?: (id: string) => void
    onEdit?: (task: Task) => void
}

export function KanbanView({ tasks, onStatusChange, onDelete, onEdit }: KanbanViewProps) {
    const t = useTranslations('navigation.tasks.columns')

    const COLUMNS: { id: TaskStatus; title: string; color: string; badge: string; glow: string }[] = [
        { id: 'todo', title: t('todo'), color: '#94a3b8', badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20', glow: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]' },
        { id: 'doing', title: t('doing'), color: '#818cf8', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', glow: 'shadow-[0_0_10px_rgba(129,140,248,0.6)]' },
        { id: 'done', title: t('done'), color: '#34d399', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.6)]' },
    ]

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px] overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((column) => {
                const columnTasks = tasks.filter(t => t.status === column.id)

                return (
                    <div
                        key={column.id}
                        className="flex-1 flex flex-col min-w-[320px] bg-card/60 cyber-clip border border-primary/20 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] relative group"
                    >
                        {/* Brackets and Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff05_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                        <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Status Label FUI */}
                        <div className="absolute top-3 right-6 bg-primary/10 border border-primary/30 text-[10px] uppercase tracking-widest text-primary font-mono font-bold px-2.5 py-0.5 cyber-clip-tag">
                            // COL_{column.id.toUpperCase()}
                        </div>

                        <div className="relative z-10 flex items-center justify-between mb-5 px-1 pt-2">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className={`w-2 h-2 ${column.glow}`}
                                    style={{ backgroundColor: column.color }}
                                />
                                <h3 className="font-bold text-white uppercase tracking-widest text-xs font-mono">
                                    {column.title}
                                </h3>
                                <span className={`text-[10px] font-mono border-l-2 pl-2 pr-1 py-0.5 ${column.badge}`}>
                                    {columnTasks.length} DATA
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 flex-1 space-y-3">
                            {columnTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onStatusChange={onStatusChange}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            ))}

                            {columnTasks.length === 0 && (
                                <div className="h-28 border border-dashed border-primary/20 bg-primary/5 cyber-clip-button flex items-center justify-center text-primary/40 text-xs font-mono uppercase tracking-widest relative overflow-hidden">
                                    <div className="absolute left-0 top-0 w-full h-full opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00f0ff_10px,#00f0ff_20px)]" />
                                    [ AWAITING_DATA ]
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
