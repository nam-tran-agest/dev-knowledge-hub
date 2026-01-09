'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createNote, updateNote } from '@/lib/actions/notes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Category, Tag, Note } from '@/types'
import { CreateCategoryDialog } from './create-category-dialog'
import { CreateTagDialog } from './create-tag-dialog'
import { ManageCategoriesDialog } from './manage-categories-dialog'
import { ManageTagsDialog } from './manage-tags-dialog'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const Editor = dynamic(() => import('./editor'), { ssr: false })

interface NoteFormProps {
    categories: Category[]
    tags: Tag[]
    note?: Note
}

export function NoteForm({ categories, tags, note }: NoteFormProps) {
    const [title, setTitle] = useState(note?.title || '')
    const [content, setContent] = useState(note?.content || '')
    const [categoryId, setCategoryId] = useState<string>(note?.category_id || '')
    const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags?.map(t => t.id) || [])
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        startTransition(async () => {
            try {
                if (note) {
                    await updateNote(note.id, {
                        title: title.trim(),
                        content,
                        categoryId: categoryId || null,
                        tagIds: selectedTags,
                    })
                    router.refresh()
                } else {
                    await createNote({
                        title: title.trim(),
                        content,
                        categoryId: categoryId || undefined,
                        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
                    })
                    // createNote already redirects to the new note page
                }
            } catch (error) {
                console.error('Failed to save note:', error)
                alert('Failed to save note. Please try again.')
            }
        })
    }

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {note ? 'Edit Note' : 'Create New Note'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter note title..."
                                className="bg-gray-950/50 border-gray-700 focus:border-blue-500/50 transition-colors"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="category">Category</Label>
                                <div className="flex items-center gap-1">
                                    <ManageCategoriesDialog categories={categories} />
                                    <CreateCategoryDialog />
                                </div>
                            </div>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger className="bg-gray-950/50 border-gray-700 focus:border-blue-500/50">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                {category.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Tags</Label>
                            <div className="flex items-center gap-1">
                                <ManageTagsDialog tags={tags} />
                                <CreateTagDialog />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-gray-950/30 border border-gray-800/50 min-h-[3rem]">
                            {tags.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No tags created yet</p>
                            )}
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-sm transition-all duration-200 border",
                                        selectedTags.includes(tag.id)
                                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                            : "bg-gray-800/40 text-gray-400 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600"
                                    )}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <div className="border border-gray-700/50 rounded-md min-h-[400px] overflow-hidden bg-gray-950/30">
                            <Editor
                                initialContent={content}
                                onChange={setContent}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-4 border-t border-gray-800 pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-blue-500/20"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                {note ? 'Updating...' : 'Creating...'}
                            </span>
                        ) : (
                            note ? 'Update Note' : 'Create Note'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
