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

    const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
        { id: 'todo', title: t('todo'), color: '#94a3b8' },
        { id: 'doing', title: t('doing'), color: '#6366f1' },
        { id: 'done', title: t('done'), color: '#10b981' },
    ]

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px] overflow-x-auto pb-4 custom-scrollbar">
            {COLUMNS.map((column) => {
                const columnTasks = tasks.filter(t => t.status === column.id)

                return (
                    <div
                        key={column.id}
                        className="flex-1 flex flex-col min-w-[300px] bg-[#111114]/50 rounded-2xl border border-[#1e1e24] p-4"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: column.color }}
                                />
                                <h3 className="font-bold text-white uppercase tracking-wider text-xs">
                                    {column.title}
                                </h3>
                                <span className="text-[10px] bg-[#1e1e24] text-slate-500 px-1.5 py-0.5 rounded-full">
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
                                <div className="h-24 border-2 border-dashed border-[#1e1e24] rounded-xl flex items-center justify-center text-slate-600 text-xs italic">
                                    No tasks here
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
