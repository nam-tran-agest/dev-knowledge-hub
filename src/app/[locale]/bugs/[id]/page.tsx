import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBug, deleteBug, toggleBugResolved } from '@/lib/actions/bugs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

interface BugDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function BugDetailPage({ params }: BugDetailPageProps) {
    const { id } = await params
    const bug = await getBug(id)

    if (!bug) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/bugs">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{bug.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {bug.created_at ? formatDate(bug.created_at) : 'No date'}
                            </span>
                            <Badge variant={bug.resolved ? 'default' : 'destructive'} className="gap-1">
                                {bug.resolved ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" />
                                        Resolved
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3 w-3" />
                                        Open
                                    </>
                                )}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <form
                        action={async () => {
                            'use server'
                            await toggleBugResolved(id)
                        }}
                    >
                        <Button variant="outline" type="submit">
                            {bug.resolved ? 'Reopen' : 'Mark Resolved'}
                        </Button>
                    </form>
                    <Button variant="outline" asChild>
                        <Link href={`/bugs/${bug.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <form
                        action={async () => {
                            'use server'
                            await deleteBug(id)
                        }}
                    >
                        <Button variant="destructive" type="submit">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </form>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {bug.error_message && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-destructive">Error Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-sm font-mono bg-destructive/10 p-4 rounded-lg overflow-x-auto">
                                {bug.error_message}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {bug.stack_trace && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Stack Trace</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto max-h-64">
                                {bug.stack_trace}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {bug.root_cause && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-orange-500">Root Cause</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{bug.root_cause}</p>
                        </CardContent>
                    </Card>
                )}

                {bug.solution && (
                    <Card className="border-green-500/30">
                        <CardHeader>
                            <CardTitle className="text-green-500">Solution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{bug.solution}</p>
                        </CardContent>
                    </Card>
                )}

                {!bug.error_message && !bug.stack_trace && !bug.root_cause && !bug.solution && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>No details added yet.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href={`/bugs/${bug.id}/edit`}>Add details</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
