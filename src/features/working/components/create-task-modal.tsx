'use client'

import React, { useState, useTransition } from 'react'
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
import { createTask } from '@/features/working/services/tasks'
import { Loader2, Plus, Terminal, FolderKanban } from 'lucide-react'
import { Task, TaskStatus, TaskPriority, Project } from '@/features/working/types'
import { useTranslations } from 'next-intl'

interface CreateTaskModalProps {
    projectId?: string
    projects?: Project[]
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultStatus?: TaskStatus
    onSuccess?: (newTask: Task) => void
}

export function CreateTaskModal({
    projectId,
    projects = [],
    open,
    onOpenChange,
    defaultStatus = 'todo',
    onSuccess
}: CreateTaskModalProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations('navigation.tasks.columns')

    const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || (projects[0]?.id || ''))
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium' as TaskPriority,
    })

    // Reset form on open
    React.useEffect(() => {
        if (open) {
            setSelectedProjectId(projectId || (projects[0]?.id || ''))
            setFormData({
                title: '',
                description: '',
                status: defaultStatus,
                priority: 'medium',
            })
            setError(null)
        }
    }, [open, defaultStatus, projectId, projects])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const targetProjectId = projectId || selectedProjectId
        if (!targetProjectId) {
            setError('Please create or select an active project first.')
            return
        }
        if (!formData.title.trim()) return
        setError(null)

        startTransition(async () => {
            try {
                const created = await createTask({
                    title: formData.title.trim(),
                    description: formData.description.trim() || undefined,
                    status: formData.status,
                    priority: formData.priority,
                    project_id: targetProjectId,
                })
                if (onSuccess) {
                    onSuccess(created as Task)
                }
                onOpenChange(false)
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to create task.'
                console.error('Failed to create task:', err)
                setError(message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent tag="TASK_CREATOR" className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" />
                        // INITIALIZE_NEW_TASK
                    </DialogTitle>
                    <DialogDescription>
                        Allocate a new execution task into this workspace matrix.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {error && (
                        <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                            // ERROR: {error}
                        </div>
                    )}

                    {/* Project Selector if opened from main overview */}
                    {!projectId && projects.length > 0 && (
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5 text-primary" />
                                Target Project *
                            </Label>
                            <Select
                                value={selectedProjectId}
                                onValueChange={setSelectedProjectId}
                            >
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
                                    <SelectValue placeholder="Select target project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="create-task-title" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Task Title *
                        </Label>
                        <Input
                            id="create-task-title"
                            required
                            placeholder="e.g. Implement OAuth Flow, Fix Shader Bug"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="create-task-desc" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Description
                        </Label>
                        <Textarea
                            id="create-task-desc"
                            placeholder="Technical specification, acceptance criteria, or logs..."
                            className="min-h-[80px] bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Column Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                            >
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
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
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
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

                    <DialogFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={isPending || !formData.title.trim()}
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider w-full cyber-clip-button hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)] py-4 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    CREATING_TASK...
                                </>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Terminal className="w-3.5 h-3.5" /> [ ALLOCATE_TASK ]
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
