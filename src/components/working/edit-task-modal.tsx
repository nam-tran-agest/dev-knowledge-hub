'use client'

import React, { useState, useTransition, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { updateTask } from '@/lib/actions/tasks'
import { Loader2 } from 'lucide-react'
import { Task, TaskStatus, TaskPriority } from '@/types/working'
import { useTranslations } from 'next-intl'

interface EditTaskModalProps {
    task: Task | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (updatedTask: Task) => void
}

export function EditTaskModal({ task, open, onOpenChange, onSuccess }: EditTaskModalProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations('navigation.tasks.columns')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
    })

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority || 'medium',
            })
        }
    }, [task])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!task || !formData.title) return
        setError(null)

        startTransition(async () => {
            try {
                const updated = await updateTask(task.id, formData)
                onSuccess(updated as Task)
                onOpenChange(false)
            } catch (err: any) {
                console.error('Failed to update task:', err)
                setError(err.message || 'Failed to update task.')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0c] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Update the details of your task.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="task-title" className="text-slate-200">Title</Label>
                        <Input
                            id="task-title"
                            required
                            className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="task-desc" className="text-slate-200">Description</Label>
                        <Textarea
                            id="task-desc"
                            className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20 min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-200">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#16161a] border-[#2a2a30] text-slate-200">
                                    <SelectItem value="todo">{t('todo')}</SelectItem>
                                    <SelectItem value="doing">{t('doing')}</SelectItem>
                                    <SelectItem value="done">{t('done')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-200">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#16161a] border-[#2a2a30] text-slate-200">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isPending || !formData.title}
                            className="bg-[#6366f1] hover:bg-[#5254e0] text-white w-full"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Update Task'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
