'use client'

import React, { useState } from 'react'
import { Task, TaskStatus } from '@/features/working/types'
import { TaskItem } from './task-item'
import { InlineTaskCreator } from './inline-task-creator'
import { motion, AnimatePresence } from 'motion/react'
import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TaskListProps {
    tasks: Task[]
    onStatusChange?: (id: string, status: TaskStatus) => void
    onDelete?: (id: string) => void
    onEdit?: (task: Task) => void
    onAddTask?: (title: string) => void
}

export function TaskList({
    tasks,
    onStatusChange,
    onDelete,
    onEdit,
    onAddTask
}: TaskListProps) {
    const t = useTranslations('navigation.tasks.columns')
    const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all')

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true
        return task.status === filter
    })

    const getStatusLabel = (f: string) => {
        if (f === 'all') return 'Tất cả' // Or add to translations if needed
        return t(f)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-[#111114] p-1 rounded-lg border border-[#1e1e24]">
                    {(['all', 'todo', 'doing', 'done'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f
                                ? 'bg-[#6366f1] text-white'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <span>{getStatusLabel(f)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {onAddTask && (
                    <div className="mb-6">
                        <InlineTaskCreator onSuggest={onAddTask} />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence mode="popLayout">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <TaskItem
                                        task={task}
                                        onStatusChange={onStatusChange}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center bg-[#111114]/50 border border-dashed border-[#1e1e24] rounded-2xl"
                            >
                                <div className="w-16 h-16 bg-[#16161a] rounded-full flex items-center justify-center mb-4 text-slate-600">
                                    <Clock size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-300">No tasks found</h3>
                                <p className="text-slate-500 max-w-sm mt-2">
                                    {filter === 'all'
                                        ? "Start by creating your first task above."
                                        : `No tasks currently in "${filter}" status.`}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
