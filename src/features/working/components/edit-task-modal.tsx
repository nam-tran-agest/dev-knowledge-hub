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
import { Loader2, Plus, Trash2, CheckSquare, Square, Check } from 'lucide-react'
import { Task, TaskStatus, TaskPriority, IssueType, SubTask } from '@/features/working/types'
import { useTranslations } from 'next-intl'
import { IssueTypeBadge, PriorityBadge, IssueKeyBadge, SubtasksProgressIndicator } from './task-badges'

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
        issue_type: 'task' as IssueType,
        story_points: '' as string,
        tags: '' as string,
        subtasks: [] as SubTask[],
    })

    const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority || 'medium',
                issue_type: task.issue_type || 'task',
                story_points: task.story_points !== undefined && task.story_points !== null ? String(task.story_points) : '',
                tags: task.tags?.join(', ') || '',
                subtasks: task.subtasks || [],
            })
            setNewSubtaskTitle('')
            setError(null)
        }
    }, [task, open])

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSubtaskTitle.trim()) return
        const newSubtask: SubTask = {
            id: `sub-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false
        }
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, newSubtask]
        }))
        setNewSubtaskTitle('')
    }

    const handleToggleSubtask = (id: string) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
        }))
    }

    const handleDeleteSubtask = (id: string) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(s => s.id !== id)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!task || !formData.title.trim()) return
        setError(null)

        const parsedPoints = formData.story_points ? parseInt(formData.story_points, 10) : null
        const tagsList = formData.tags
            .split(',')
            .map(t => t.trim().replace(/^#/, ''))
            .filter(Boolean)

        const updatePayload = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            status: formData.status,
            priority: formData.priority,
            issue_type: formData.issue_type,
            story_points: isNaN(Number(parsedPoints)) ? null : parsedPoints,
            tags: tagsList,
            subtasks: formData.subtasks,
        }

        startTransition(async () => {
            try {
                const updated = await updateTask(task.id, updatePayload)
                onSuccess(updated as Task)
                onOpenChange(false)
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to update task.'
                console.error('Failed to update task:', err)
                setError(message)
            }
        })
    }

    const displayKey = task?.issue_key || (task ? `TASK-${task.id.slice(0, 4).toUpperCase()}` : 'TASK')
    const completedSubtasksCount = formData.subtasks.filter(s => s.completed).length

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent tag="TASK_ISSUE_DETAILS" className="sm:max-w-[560px] font-mono max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader className="border-b border-primary/15 pb-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <IssueKeyBadge issueKey={displayKey} />
                            <IssueTypeBadge type={formData.issue_type} size="sm" />
                        </div>
                        <span className="text-[10px] text-primary/60 font-mono tracking-widest uppercase">
                            // ISSUE_PARAMETERS
                        </span>
                    </div>
                    <DialogTitle className="text-base font-bold text-white tracking-wide pt-1">
                        {task?.title || 'Edit Issue'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-primary/60 font-mono">
                        Adjust workflow state, technical specifications, and checklist progress.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {error && (
                        <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                            // ERROR: {error}
                        </div>
                    )}

                    {/* Row 1: Issue Type & Status Transition */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Issue Type</Label>
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
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Workflow State</Label>
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

                    {/* Summary */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-task-title" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Issue Summary / Title *
                        </Label>
                        <Input
                            id="edit-task-title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-task-desc" className="text-primary/80 font-mono text-xs uppercase tracking-wider">
                            Description & Acceptance Criteria
                        </Label>
                        <Textarea
                            id="edit-task-desc"
                            className="min-h-[85px] bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs leading-relaxed"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Subtasks Checklist Section */}
                    <div className="space-y-2 p-3 bg-surface-deep/80 border border-primary/20 cyber-clip-button">
                        <div className="flex items-center justify-between">
                            <Label className="text-primary font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <CheckSquare className="w-3.5 h-3.5 text-primary" />
                                Subtasks Checklist
                            </Label>
                            {formData.subtasks.length > 0 && (
                                <SubtasksProgressIndicator 
                                    completed={completedSubtasksCount} 
                                    total={formData.subtasks.length} 
                                />
                            )}
                        </div>

                        {/* List of subtasks */}
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
                            {formData.subtasks.map((subtask) => (
                                <div 
                                    key={subtask.id}
                                    className="flex items-center justify-between gap-2 p-1.5 bg-[#040712]/90 border border-primary/15 hover:border-primary/40 cyber-clip-tag transition-all group"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleToggleSubtask(subtask.id)}
                                        className="flex items-center gap-2 text-xs font-mono text-left flex-1 min-w-0 cursor-pointer"
                                    >
                                        {subtask.completed ? (
                                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                            <Square className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary shrink-0" />
                                        )}
                                        <span className={subtask.completed ? "line-through text-primary/40 truncate" : "text-white/90 truncate"}>
                                            {subtask.title}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSubtask(subtask.id)}
                                        className="text-primary/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-0.5 cursor-pointer"
                                        title="Delete subtask"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Input to add new subtask */}
                        <div className="flex items-center gap-2 pt-1">
                            <Input
                                placeholder="Add checklist item and press '+'..."
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddSubtask(e)
                                    }
                                }}
                                className="h-8 text-xs font-mono bg-[#02050f] border-primary/25 focus:border-primary"
                            />
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleAddSubtask}
                                className="h-8 px-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary cyber-clip-button cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Row 3: Priority & Story Points */}
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
                            <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Story Points (Agile)</Label>
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

                    <DialogFooter className="pt-2 border-t border-primary/15">
                        <Button
                            type="submit"
                            disabled={isPending || !formData.title.trim()}
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider w-full cyber-clip-button hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)] py-3.5 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    COMMITTING_CHANGES...
                                </>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Check className="w-4 h-4 stroke-[3]" /> [ SAVE_ISSUE_CHANGES ]
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
