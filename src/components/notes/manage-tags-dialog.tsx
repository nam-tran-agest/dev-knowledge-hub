'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateTag, deleteTag } from '@/lib/actions/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Settings, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react'
import type { Tag } from '@/types'

interface ManageTagsDialogProps {
    tags: Tag[]
}

export function ManageTagsDialog({ tags }: ManageTagsDialogProps) {
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const startEdit = (tag: Tag) => {
        setEditingId(String(tag.id))
        setEditName(tag.name || tag.label || '')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditName('')
    }

    const handleUpdate = (id: string) => {
        if (!editName.trim()) return

        startTransition(async () => {
            await updateTag(id, editName.trim())
            cancelEdit()
            router.refresh()
        })
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            startTransition(async () => {
                await deleteTag(id)
                router.refresh()
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Manage Tags">
                    <Settings className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Tags</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 mt-4">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center gap-2 p-2 border rounded-md group">
                            {editingId === String(tag.id) ? (
                                <div className="flex-1 flex gap-2 items-center">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-8"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleUpdate(String(tag.id))}
                                        disabled={isPending}
                                        className="h-8 w-8 text-green-500 hover:text-green-600"
                                    >
                                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={cancelEdit}
                                        disabled={isPending}
                                        className="h-8 w-8 text-muted-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span className="flex-1 text-sm font-medium truncate">#{tag.name || tag.label}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => startEdit(tag)}
                                            className="h-7 w-7"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(String(tag.id))}
                                            disabled={isPending}
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground py-4">No tags found.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
