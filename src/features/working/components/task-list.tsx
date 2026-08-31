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
        if (f === 'all') return 'ALL'
        return t(f)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-surface p-1 cyber-clip-button border border-primary/30">
                    {(['all', 'todo', 'doing', 'done'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 cyber-clip-button text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                                filter === f
                                    ? 'bg-primary text-black font-bold shadow-[0_0_10px_var(--color-primary)]'
                                    : 'text-primary/60 hover:text-white'
                            }`}
                        >
                            <span>[ {getStatusLabel(f)} ]</span>
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
                                className="flex flex-col items-center justify-center py-20 text-center bg-surface/60 border border-dashed border-primary/25 cyber-clip relative overflow-hidden"
                            >
                                <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
                                <div className="w-12 h-12 bg-primary/10 border border-primary/30 cyber-clip-button flex items-center justify-center mb-4 text-primary">
                                    <Clock size={24} />
                                </div>
                                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">[ NO_ACTIVE_TASKS ]</h3>
                                <p className="text-primary/60 font-mono text-xs max-w-sm mt-1 uppercase">
                                    {filter === 'all'
                                        ? "// Initialize your first task using the buffer above."
                                        : `// No tasks allocated under "${filter}" status.`}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
