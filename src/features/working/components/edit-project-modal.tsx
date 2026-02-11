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
import { updateProject, deleteProject } from '@/features/working/services/projects'
import { Loader2, Trash2 } from 'lucide-react'
import { Project } from '@/features/working/types'
import { useRouter } from '@/i18n/routing'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const COLORS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Violet
]

interface EditProjectModalProps {
    project: Project
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProjectModal({ project, open, onOpenChange }: EditProjectModalProps) {
    const [isPending, startTransition] = useTransition()
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description || '',
        color: project.color,
        icon: project.icon || 'Layout'
    })

    // Update form data if project changes
    useEffect(() => {
        setFormData({
            name: project.name,
            description: project.description || '',
            color: project.color,
            icon: project.icon || 'Layout'
        })
    }, [project])

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)
        try {
            await deleteProject(project.id)
            onOpenChange(false)
            router.push('/working')
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete project.';
            console.error('Failed to delete project:', err)
            setError(message)
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return
        setError(null)

        startTransition(async () => {
            try {
                await updateProject(project.id, formData)
                onOpenChange(false)
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to update project.';
                console.error('Failed to update project:', err)
                setError(message)
            }
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-[#0a0a0c] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Project Settings</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update your project details and appearance.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-slate-200">Name</Label>
                            <Input
                                id="edit-name"
                                required
                                className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-slate-200">Description</Label>
                            <Input
                                id="edit-description"
                                className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-200">Theme Color</Label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0c]' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <DialogFooter className="sm:justify-between gap-3 flex flex-col-reverse sm:flex-row">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 px-0 font-normal justify-start sm:justify-center"
                                >
                                    <Trash2 size={16} />
                                    Delete Project
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending || isDeleting || !formData.name}
                                    className="bg-[#6366f1] hover:bg-[#5254e0] text-white px-8"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="bg-[#0a0a0c] border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently delete the
                            <span className="text-white font-semibold"> {project.name} </span>
                            project and all its tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Project'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
