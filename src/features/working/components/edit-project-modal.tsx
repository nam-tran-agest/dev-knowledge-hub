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
import { ProjectColorPicker } from './project-color-picker'
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
                <DialogContent className="sm:max-w-[425px] bg-[#070d1e] border-white/10 text-white rounded-3xl backdrop-blur-2xl glare-top">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Project Settings</DialogTitle>
                        <DialogDescription className="text-slate-400 text-xs">
                            Update your project details, color theme and preferences.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5 pt-3">
                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-slate-200 text-xs font-mono">Name</Label>
                            <Input
                                id="edit-name"
                                required
                                className="bg-[#040711]/80 border-white/10 text-white focus:border-indigo-500/50 rounded-xl text-sm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-slate-200 text-xs font-mono">Description</Label>
                            <Input
                                id="edit-description"
                                className="bg-[#040711]/80 border-white/10 text-white focus:border-indigo-500/50 rounded-xl text-sm"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <ProjectColorPicker
                            selectedColor={formData.color}
                            onColorSelect={(color) => setFormData({ ...formData, color })}
                        />

                        <div className="pt-4 border-t border-white/5 space-y-4">
                            <DialogFooter className="sm:justify-between gap-3 flex flex-col-reverse sm:flex-row">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-2 px-3 font-normal rounded-xl cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending || isDeleting || !formData.name}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]"
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
                <AlertDialogContent className="bg-[#070d1e] border-white/10 text-white rounded-3xl backdrop-blur-2xl glare-top">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-bold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-xs">
                            This action cannot be undone. This will permanently delete
                            <span className="text-white font-semibold"> {project.name} </span>
                            and all associated tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="bg-white/[0.04] border-white/10 text-slate-300 hover:text-white rounded-xl cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]"
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
