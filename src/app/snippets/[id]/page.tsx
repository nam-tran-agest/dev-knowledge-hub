import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSnippet, deleteSnippet } from '@/lib/actions/snippets'
import { CodeBlock } from '@/components/shared/code-block'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2, Calendar, Code, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'

interface SnippetDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function SnippetDetailPage({ params }: SnippetDetailPageProps) {
    const { id } = await params
    const snippet = await getSnippet(id)

    if (!snippet) {
        notFound()
    }

    const Icon = snippet.type === 'prompt' ? Sparkles : Code

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/snippets">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{snippet.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(snippet.created_at)}
                            </span>
                            <Badge variant="secondary" className="gap-1">
                                <Icon className="h-3 w-3" />
                                {snippet.type}
                            </Badge>
                            <Badge variant="outline" className="uppercase">
                                {snippet.language}
                            </Badge>
                        </div>
                        {snippet.description && (
                            <p className="text-muted-foreground">{snippet.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/snippets/${snippet.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <form
                        action={async () => {
                            'use server'
                            await deleteSnippet(id)
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
            <Card>
                <CardContent className="p-6">
                    <CodeBlock
                        code={snippet.content}
                        language={snippet.language}
                        showCopyButton
                    />
                </CardContent>
            </Card>
        </div>
    )
}
