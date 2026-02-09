'use client'

import React, { useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProject } from '@/lib/actions/projects'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from '@/i18n/routing'

const COLORS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Violet
]

export function CreateProjectModal() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: COLORS[0],
        icon: 'Layout'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return
        setError(null)

        startTransition(async () => {
            try {
                const project = await createProject(formData)
                setOpen(false)
                setFormData({ name: '', description: '', color: COLORS[0], icon: 'Layout' })
                router.push(`/working/${project.id}`)
            } catch (err: any) {
                console.error('Failed to create project:', err)
                setError(err.message || 'Failed to create project. Please verify you are logged in.')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full h-full min-h-[160px] border-2 border-dashed border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20 transition-all flex flex-col gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#6366f1]/20 group-hover:text-[#6366f1] transition-all">
                        <Plus size={24} />
                    </div>
                    <span className="text-slate-400 font-medium pt-2">Create New Project</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0c] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Give your project a name and choose a base color.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200">Name</Label>
                        <Input
                            id="name"
                            required
                            placeholder="e.g. My Awesome App"
                            className="bg-white/5 border-white/10 focus:border-[#6366f1]/50 focus:ring-[#6366f1]/20"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-200">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="Briefly describe your project..."
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
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isPending || !formData.name}
                            className="bg-[#6366f1] hover:bg-[#5254e0] text-white w-full"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
