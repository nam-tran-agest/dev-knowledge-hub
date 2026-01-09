'use client'

import { useState, useTransition } from 'react'
import { updateTaskStatus, deleteTask, createTask } from '@/lib/actions/tasks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatRelative } from '@/lib/utils/date'
import { TASK_COLUMNS, CC_STYLES } from '@/lib/constants'
import { Plus, Trash2, Calendar, GripVertical, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, TaskStatus } from '@/types'

interface TaskBoardProps {
    initialTasks: Task[]
}

export function TaskBoard({ initialTasks }: TaskBoardProps) {
    const [tasks, setTasks] = useState(initialTasks)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null)
    const [isPending, startTransition] = useTransition()

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter((task) => task.status === status)

    const handleAddTask = (status: TaskStatus) => {
        if (!newTaskTitle.trim()) return

        startTransition(async () => {
            const newTask = await createTask({
                title: newTaskTitle.trim(),
                status,
            })
            setTasks([...tasks, newTask])
            setNewTaskTitle('')
            setAddingToColumn(null)
        })
    }

    const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
        startTransition(async () => {
            await updateTaskStatus(taskId, newStatus)
            setTasks(tasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            ))
        })
    }

    const handleDeleteTask = (taskId: string) => {
        startTransition(async () => {
            await deleteTask(taskId)
            setTasks(tasks.filter(t => t.id !== taskId))
        })
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-12rem)]">
            {TASK_COLUMNS.map((column) => (
                <div key={column.id} className="flex flex-col h-full bg-black/20 rounded-xl border border-white/5 p-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                            <h2 className="font-semibold text-gray-200">{column.title}</h2>
                            <Badge variant="secondary" className="ml-1 bg-white/10 text-gray-400">
                                {getTasksByStatus(column.id).length}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-white"
                            onClick={() => setAddingToColumn(column.id)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {/* Add Task Form */}
                        {addingToColumn === column.id && (
                            <Card className="animate-fade-in border-dashed bg-white/5 border-white/20">
                                <CardContent className="p-3 space-y-2">
                                    <Input
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Task title..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddTask(column.id)
                                            if (e.key === 'Escape') setAddingToColumn(null)
                                        }}
                                        autoFocus
                                        className="h-8 text-sm"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddTask(column.id)}
                                            disabled={isPending || !newTaskTitle.trim()}
                                            className="h-7 text-xs"
                                        >
                                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setAddingToColumn(null)
                                                setNewTaskTitle('')
                                            }}
                                            className="h-7 text-xs"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tasks */}
                        {getTasksByStatus(column.id).map((task) => (
                            <Card key={task.id} className={cn("group cursor-move transition-all hover:bg-white/10", CC_STYLES.card)}>
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex items-start gap-2">
                                        <GripVertical className="h-4 w-4 text-gray-600 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                                        <CardTitle className="text-sm font-medium flex-1 text-gray-200 leading-snug">
                                            {task.title}
                                        </CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 text-gray-500 hover:text-red-400"
                                            onClick={() => handleDeleteTask(task.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 pt-2">
                                    {task.description && (
                                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        {task.deadline && (
                                            <span className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                                <Calendar className="h-3 w-3" />
                                                {formatRelative(task.deadline)}
                                            </span>
                                        )}
                                        <div className="flex gap-1 ml-auto">
                                            {TASK_COLUMNS.filter(c => c.id !== column.id).map((targetColumn) => (
                                                <div
                                                    key={targetColumn.id}
                                                    className={`w-2 h-2 rounded-full ${targetColumn.color} cursor-pointer opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all`}
                                                    onClick={() => handleMoveTask(task.id, targetColumn.id)}
                                                    title={`Move to ${targetColumn.title}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
