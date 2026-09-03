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
import { Task, TaskStatus, TaskPriority, IssueType, Project } from '@/features/working/types'
import { useTranslations } from 'next-intl'
import { IssueTypeBadge, PriorityBadge } from './task-badges'

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
        issue_type: 'task' as IssueType,
        story_points: '' as string,
        tags: '' as string,
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
                issue_type: 'task',
                story_points: '',
                tags: '',
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

        const parsedPoints = formData.story_points ? parseInt(formData.story_points, 10) : null
        const tagsList = formData.tags
            .split(',')
            .map(t => t.trim().replace(/^#/, ''))
            .filter(Boolean)

        startTransition(async () => {
            try {
                const created = await createTask({
                    title: formData.title.trim(),
                    description: formData.description.trim() || undefined,
                    status: formData.status,
                    priority: formData.priority,
                    issue_type: formData.issue_type,
                    story_points: isNaN(Number(parsedPoints)) ? null : parsedPoints,
                    tags: tagsList.length > 0 ? tagsList : undefined,
                    project_id: targetProjectId,
                })
                if (created && 'error' in created && (created as { error?: string }).error) {
                    setError(String((created as { error?: string }).error))
                    return
                }
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
            <DialogContent tag="TASK_CREATOR" className="sm:max-w-[520px] font-mono">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" />
                        // ALLOCATE_NEW_TASK
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs text-primary/60">
                        Thêm công việc mới vào bảng công việc hoặc backlog của dự án.
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
                                <SelectContent className="font-mono">
                                    {projects.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Row 1: Task Type & Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Loại công việc (Type)</Label>
                            <Select
                                value={formData.issue_type}
                                onValueChange={(value) => setFormData({ ...formData, issue_type: value as IssueType })}
                            >
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="font-mono">
                                    <SelectItem value="story">
                                        <div className="flex items-center gap-2"><IssueTypeBadge type="story" size="sm" /></div>
                                    </SelectItem>
                                    <SelectItem value="task">
                                        <div className="flex items-center gap-2"><IssueTypeBadge type="task" size="sm" /></div>
                                    </SelectItem>
                                    <SelectItem value="bug">
                                        <div className="flex items-center gap-2"><IssueTypeBadge type="bug" size="sm" /></div>
                                    </SelectItem>
                                    <SelectItem value="epic">
                                        <div className="flex items-center gap-2"><IssueTypeBadge type="epic" size="sm" /></div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Status Column</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                            >
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="font-mono">
                                    <SelectItem value="backlog">{t('backlog') || 'Backlog'}</SelectItem>
                                    <SelectItem value="todo">{t('todo') || 'To Do'}</SelectItem>
                                    <SelectItem value="doing">{t('doing') || 'In Progress'}</SelectItem>
                                    <SelectItem value="review">{t('review') || 'In Review'}</SelectItem>
                                    <SelectItem value="done">{t('done') || 'Done'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="create-task-title" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Issue Summary / Title *
                        </Label>
                        <Input
                            id="create-task-title"
                            required
                            placeholder="e.g. As a developer, I want to authenticate via OAuth"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="create-task-desc" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Description & Acceptance Criteria
                        </Label>
                        <Textarea
                            id="create-task-desc"
                            placeholder="Detailed technical context, steps to reproduce, or specifications..."
                            className="min-h-[75px] bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Row 2: Priority & Story Points */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Priority Level</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                            >
                                <SelectTrigger className="bg-[#030712]/90 border-primary/30 text-xs font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="font-mono">
                                    <SelectItem value="highest">
                                        <div className="flex items-center gap-2"><PriorityBadge priority="highest" showLabel /></div>
                                    </SelectItem>
                                    <SelectItem value="high">
                                        <div className="flex items-center gap-2"><PriorityBadge priority="high" showLabel /></div>
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        <div className="flex items-center gap-2"><PriorityBadge priority="medium" showLabel /></div>
                                    </SelectItem>
                                    <SelectItem value="low">
                                        <div className="flex items-center gap-2"><PriorityBadge priority="low" showLabel /></div>
                                    </SelectItem>
                                    <SelectItem value="lowest">
                                        <div className="flex items-center gap-2"><PriorityBadge priority="lowest" showLabel /></div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Story Points (Fibonacci)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="1, 2, 3, 5, 8, 13..."
                                value={formData.story_points}
                                onChange={(e) => setFormData({ ...formData, story_points: e.target.value })}
                                className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                        <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Labels / Tags (comma separated)
                        </Label>
                        <Input
                            placeholder="frontend, auth, p1, security"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
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
                                    ĐANG TẠO CÔNG VIỆC...
                                </>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Terminal className="w-3.5 h-3.5" /> [ TẠO CÔNG VIỆC ]
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
