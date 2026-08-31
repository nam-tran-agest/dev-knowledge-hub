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
import { Loader2, Trash2, Settings } from 'lucide-react'
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
                <DialogContent tag="PROJECT_CONFIG" className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>
                            <Settings className="w-4 h-4 text-primary" />
                            // CONFIG_PROJECT
                        </DialogTitle>
                        <DialogDescription>
                            Update project telemetry details, color theme, and preferences.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {error && (
                            <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                                // ERROR: {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name" className="text-primary/80 text-xs font-mono uppercase tracking-wider">Project Name *</Label>
                            <Input
                                id="edit-name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description" className="text-primary/80 text-xs font-mono uppercase tracking-wider">Description</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <ProjectColorPicker
                            selectedColor={formData.color}
                            onColorSelect={(color) => setFormData({ ...formData, color })}
                        />

                        <div className="pt-3 border-t border-primary/20 space-y-4">
                            <DialogFooter className="sm:justify-between gap-2 flex flex-col-reverse sm:flex-row">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-destructive hover:text-white hover:bg-destructive/20 gap-1.5 px-3 font-mono text-xs uppercase cyber-clip-button cursor-pointer"
                                >
                                    <Trash2 size={13} />
                                    [ DELETE ]
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending || isDeleting || !formData.name}
                                    className="bg-primary text-black font-mono font-bold uppercase tracking-wider px-6 cyber-clip-button cursor-pointer shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            SAVING...
                                        </>
                                    ) : (
                                        '[ SAVE_CHANGES ]'
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent className="border-destructive/40 text-white shadow-[0_0_50px_rgba(255,0,60,0.3)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-mono font-bold uppercase tracking-wider text-destructive">
                            // WARNING: IRREVERSIBLE_PURGE
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-primary/70 text-xs font-mono">
                            This action cannot be rolled back. This will permanently delete
                            <span className="text-white font-bold"> {project.name} </span>
                            and all associated tasks.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="bg-transparent border border-primary/30 text-primary hover:bg-primary/10 cyber-clip-button font-mono text-xs uppercase cursor-pointer">
                            [ CANCEL ]
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-white cyber-clip-button font-mono text-xs uppercase font-bold cursor-pointer shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    PURGING...
                                </>
                            ) : (
                                '[ CONFIRM_PURGE ]'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
