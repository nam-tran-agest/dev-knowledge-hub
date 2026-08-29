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
import { updateTask } from '@/features/working/services/tasks'
import { Loader2, Edit3 } from 'lucide-react'
import { Task, TaskStatus, TaskPriority } from '@/features/working/types'
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
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to update task.';
                console.error('Failed to update task:', err)
                setError(message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent tag="TASK_MODIFIER" className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        <Edit3 className="w-4 h-4 text-primary" />
                        // EDIT_TASK_PARAM
                    </DialogTitle>
                    <DialogDescription>
                        Modify task parameters, status state, and priority rank.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {error && (
                        <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                            // ERROR: {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="task-title" className="text-primary/80 font-mono text-xs uppercase tracking-wider">Title *</Label>
                        <Input
                            id="task-title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="task-desc" className="text-primary/80 font-mono text-xs uppercase tracking-wider">Description</Label>
                        <Textarea
                            id="task-desc"
                            className="min-h-[90px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Status Column</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">{t('todo')}</SelectItem>
                                    <SelectItem value="doing">{t('doing')}</SelectItem>
                                    <SelectItem value="done">{t('done')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Priority Rank</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">LOW</SelectItem>
                                    <SelectItem value="medium">MEDIUM</SelectItem>
                                    <SelectItem value="high">HIGH</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isPending || !formData.title}
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider w-full cyber-clip-button hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    UPDATING...
                                </>
                            ) : (
                                '[ EXECUTE_UPDATE ]'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
