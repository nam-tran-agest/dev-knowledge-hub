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

    const COLUMNS: { id: TaskStatus; title: string; color: string; badge: string }[] = [
        { id: 'todo', title: t('todo'), color: '#94a3b8', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
        { id: 'doing', title: t('doing'), color: '#818cf8', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        { id: 'done', title: t('done'), color: '#34d399', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    ]

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px] overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((column) => {
                const columnTasks = tasks.filter(t => t.status === column.id)

                return (
                    <div
                        key={column.id}
                        className="flex-1 flex flex-col min-w-[320px] bg-white/[0.02] rounded-3xl border border-white/10 p-5 backdrop-blur-xl shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-5 px-1">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                                    style={{ backgroundColor: column.color }}
                                />
                                <h3 className="font-bold text-white uppercase tracking-wider text-xs">
                                    {column.title}
                                </h3>
                                <span className={`text-[11px] font-mono border px-2 py-0.5 rounded-full ${column.badge}`}>
                                    {columnTasks.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
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
                                <div className="h-28 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-medium">
                                    No tasks in {column.title.toLowerCase()}
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
