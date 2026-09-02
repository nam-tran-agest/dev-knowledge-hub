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
import { createProject } from '@/features/working/services/projects'
import { Plus, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from '@/i18n/routing'

const COLORS = [
    '#00f0ff', // Cyber Cyan
    '#ff007f', // Neon Magenta
    '#ffb703', // Neon Amber
    '#00f59b', // Neon Green
    '#7928ca', // Cyber Purple
    '#3b82f6', // Electric Blue
    '#ff003c', // Cyber Red
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
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to create project. Please verify you are logged in.';
                console.error('Failed to create project:', err)
                setError(message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full h-full min-h-[160px] border border-dashed border-primary/30 bg-primary/[0.02] hover:bg-primary/[0.08] hover:border-primary transition-all flex flex-col gap-2 group cyber-clip cursor-pointer">
                    <div className="w-10 h-10 cyber-clip-button bg-primary/10 border border-primary/40 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                        <Plus size={20} className="text-primary group-hover:text-black" />
                    </div>
                    <span className="text-primary/70 font-mono text-xs uppercase tracking-widest pt-2 group-hover:text-primary">
                        [ + CREATE_NEW_PROJECT ]
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent tag="PROJ_INITIALIZER" className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>
                        <Sparkles className="w-4 h-4 text-primary" />
                        INIT_NEW_PROJECT
                    </DialogTitle>
                    <DialogDescription>
                        Allocate system resources and configure project parameters.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {error && (
                        <div className="p-3 cyber-clip-button bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                            // ERROR: {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-primary/80 font-mono text-xs uppercase tracking-wider">Project Name *</Label>
                        <Input
                            id="name"
                            required
                            placeholder="e.g. NEURAL_INTERFACE_V2"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-primary/80 font-mono text-xs uppercase tracking-wider">Description (Optional)</Label>
                        <Input
                            id="description"
                            placeholder="Enter project telemetry details..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-[#030712]/90 border-primary/30 focus:border-primary text-white font-mono text-xs"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-primary/80 font-mono text-xs uppercase tracking-wider">Neon Theme Accent</Label>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-7 h-7 cyber-clip-button transition-all hover:scale-110 cursor-pointer border ${
                                        formData.color === color ? 'border-white shadow-[0_0_12px_var(--color-primary)] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
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
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider w-full cyber-clip-button hover:bg-primary/90 shadow-[0_0_20px_var(--color-primary)]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ALLOCATING...
                                </>
                            ) : (
                                '[ EXECUTE_CREATE ]'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
