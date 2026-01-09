'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createTag } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'

export function CreateTagDialog() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        startTransition(async () => {
            await createTag(name.trim())
            setOpen(false)
            setName('')
            router.refresh()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    <Plus className="mr-2 h-3 w-3" />
                    New Tag
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tag-name">Name</Label>
                        <Input
                            id="tag-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. react, typescript"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
