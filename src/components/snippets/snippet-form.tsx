'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSnippet } from '@/lib/actions/snippets'
import { LANGUAGES } from '@/lib/constants'
import { SPACING } from '@/lib/constants/styles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Snippet } from '@/types'

interface EditSnippetFormProps {
    snippet: Snippet
}

export default function EditSnippetForm({ snippet }: EditSnippetFormProps) {
    const [title, setTitle] = useState(snippet.title)
    const [content, setContent] = useState(snippet.content)
    const [description, setDescription] = useState(snippet.description || '')
    const [language, setLanguage] = useState(snippet.language)
    const [type, setType] = useState<'code' | 'prompt'>(snippet.type)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        startTransition(async () => {
            try {
                await updateSnippet(String(snippet.id), {
                    title: title.trim(),
                    content,
                    language,
                    type,
                    description: description.trim() || undefined,
                })
                router.refresh()
            } catch (error) {
                console.error('Failed to update snippet:', error)
                alert('Failed to update snippet. Please try again.')
            }
        })
    }

    return (
        <div className="form-container form-section">
            {/* Header */}
            <div className="flex-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/snippets/${snippet.id}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Snippet</h1>
                    <p className="text-muted-foreground">Update your code or prompt</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={SPACING.md}>
                <Card>
                    <CardHeader>
                        <CardTitle>Snippet Details</CardTitle>
                    </CardHeader>
                    <CardContent className={SPACING.sm}>
                        {/* Title */}
                        <div className="form-field">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter snippet title..."
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="form-field">
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={(v) => setType(v as 'code' | 'prompt')}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="code">Code Snippet</SelectItem>
                                    <SelectItem value="prompt">AI Prompt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Language (only for code) */}
                        {type === 'code' && (
                            <div className="form-field">
                                <Label htmlFor="language">Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Description */}
                        <div className="form-field">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the snippet..."
                            />
                        </div>

                        {/* Content */}
                        <div className="form-field">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={type === 'code' ? 'Paste your code here...' : 'Write your prompt here...'}
                                className="min-h-[300px] font-mono"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="button-group">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !title.trim() || !content.trim()}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Snippet'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
