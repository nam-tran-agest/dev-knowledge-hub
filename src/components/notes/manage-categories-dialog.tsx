'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCategory, deleteCategory } from '@/lib/actions/categories'
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
import type { Category } from '@/types'

interface ManageCategoriesDialogProps {
    categories: Category[]
}

import { useTranslations } from 'next-intl'

export function ManageCategoriesDialog({ categories }: ManageCategoriesDialogProps) {
    const t = useTranslations('notes.dialogs.manageCategories')
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState('')
    const [editColor, setEditColor] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const startEdit = (category: Category) => {
        setEditingId(String(category.id))
        setEditName(category.name || category.label || '')
        setEditColor(category.color || '#888888')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditName('')
        setEditColor('')
    }

    const handleUpdate = (id: string) => {
        if (!editName.trim()) return

        startTransition(async () => {
            await updateCategory(id, editName.trim(), editColor)
            cancelEdit()
            router.refresh()
        })
    }

    const handleDelete = (id: string) => {
        if (confirm(t('confirmDelete'))) {
            startTransition(async () => {
                await deleteCategory(id)
                router.refresh()
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title={t('trigger')}>
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 mt-4">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center gap-2 p-2 border rounded-md group">
                            {editingId === String(category.id) ? (
                                <div className="flex-1 flex gap-2 items-center">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-8"
                                    />
                                    <Input
                                        type="color"
                                        value={editColor}
                                        onChange={(e) => setEditColor(e.target.value)}
                                        className="w-8 h-8 p-0 border-0"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleUpdate(String(category.id))}
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
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <span className="flex-1 text-sm font-medium truncate">{category.name || category.label}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => startEdit(category)}
                                            className="h-7 w-7"
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(String(category.id))}
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
                    {categories.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground py-4">{t('empty')}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
