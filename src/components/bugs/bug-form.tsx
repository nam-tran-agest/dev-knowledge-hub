'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBug } from '@/lib/actions/bugs'
import { SPACING } from '@/lib/constants/styles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Bug } from '@/types'

interface EditBugFormProps {
    bug: Bug
}

export default function EditBugForm({ bug }: EditBugFormProps) {
    const [title, setTitle] = useState(bug.title)
    const [errorMessage, setErrorMessage] = useState(bug.error_message || '')
    const [stackTrace, setStackTrace] = useState(bug.stack_trace || '')
    const [rootCause, setRootCause] = useState(bug.root_cause || '')
    const [solution, setSolution] = useState(bug.solution || '')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        startTransition(async () => {
            try {
                await updateBug(bug.id, {
                    title: title.trim(),
                    error_message: errorMessage.trim() || undefined,
                    stack_trace: stackTrace.trim() || undefined,
                    root_cause: rootCause.trim() || undefined,
                    solution: solution.trim() || undefined,
                })
                router.refresh()
            } catch (error) {
                console.error('Failed to update bug:', error)
                alert('Failed to update bug. Please try again.')
            }
        })
    }

    return (
        <div className="form-container form-section">
            {/* Header */}
            <div className="flex-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/bugs/${bug.id}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Bug</h1>
                    <p className="text-muted-foreground">Update bug details and solution</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={SPACING.md}>
                <Card>
                    <CardHeader>
                        <CardTitle>Bug Details</CardTitle>
                    </CardHeader>
                    <CardContent className={SPACING.sm}>
                        {/* Title */}
                        <div className="form-field">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief description of the bug..."
                                required
                            />
                        </div>

                        {/* Error Message */}
                        <div className="form-field">
                            <Label htmlFor="errorMessage">Error Message</Label>
                            <Textarea
                                id="errorMessage"
                                value={errorMessage}
                                onChange={(e) => setErrorMessage(e.target.value)}
                                placeholder="The error message you encountered..."
                                className="font-mono text-sm min-h-[80px]"
                            />
                        </div>

                        {/* Stack Trace */}
                        <div className="form-field">
                            <Label htmlFor="stackTrace">Stack Trace</Label>
                            <Textarea
                                id="stackTrace"
                                value={stackTrace}
                                onChange={(e) => setStackTrace(e.target.value)}
                                placeholder="Paste the full stack trace here..."
                                className="font-mono text-sm min-h-[150px]"
                            />
                        </div>

                        {/* Root Cause */}
                        <div className="form-field">
                            <Label htmlFor="rootCause">Root Cause</Label>
                            <Textarea
                                id="rootCause"
                                value={rootCause}
                                onChange={(e) => setRootCause(e.target.value)}
                                placeholder="What caused this bug?"
                                className="min-h-[80px]"
                            />
                        </div>

                        {/* Solution */}
                        <div className="form-field">
                            <Label htmlFor="solution">Solution</Label>
                            <Textarea
                                id="solution"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="How did you fix it?"
                                className="min-h-[120px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="button-group">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !title.trim()}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Bug'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
