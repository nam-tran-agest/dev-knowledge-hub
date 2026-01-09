'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createBug } from '@/lib/actions/bugs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewBugPage() {
    const [title, setTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [stackTrace, setStackTrace] = useState('')
    const [rootCause, setRootCause] = useState('')
    const [solution, setSolution] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        startTransition(async () => {
            try {
                await createBug({
                    title: title.trim(),
                    error_message: errorMessage.trim() || undefined,
                    stack_trace: stackTrace.trim() || undefined,
                    root_cause: rootCause.trim() || undefined,
                    solution: solution.trim() || undefined,
                })
                // createBug already redirects to the new bug page
            } catch (error) {
                console.error('Failed to create bug:', error)
                alert('Failed to create bug. Please try again.')
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/bugs">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Log New Bug</h1>
                    <p className="text-muted-foreground">Document an issue for future reference</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Bug Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                        <div className="space-y-2">
                            <Label htmlFor="rootCause">Root Cause</Label>
                            <Textarea
                                id="rootCause"
                                value={rootCause}
                                onChange={(e) => setRootCause(e.target.value)}
                                placeholder="What caused this bug? (fill in when you figure it out)"
                                className="min-h-[80px]"
                            />
                        </div>

                        {/* Solution */}
                        <div className="space-y-2">
                            <Label htmlFor="solution">Solution</Label>
                            <Textarea
                                id="solution"
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="How did you fix it? (fill in when resolved)"
                                className="min-h-[80px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending || !title.trim()}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Log Bug
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
