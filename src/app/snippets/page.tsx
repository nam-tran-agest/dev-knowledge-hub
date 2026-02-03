import Link from 'next/link'
import { getSnippets } from '@/lib/actions/snippets'
import { SnippetCard } from '@/components/snippets'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, Code } from 'lucide-react'

interface SnippetsPageProps {
    searchParams: Promise<{
        type?: 'code' | 'prompt'
        language?: string
        page?: string
    }>
}

export default async function SnippetsPage({ searchParams }: SnippetsPageProps) {
    const params = await searchParams
    const [{ data: codeSnippets }, { data: promptSnippets }] = await Promise.all([
        getSnippets({ filters: { type: 'code' }, limit: 50 }),
        getSnippets({ filters: { type: 'prompt' }, limit: 50 }),
    ])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Snippets & Prompts</h1>
                    <p className="text-muted-foreground mt-1">
                        {codeSnippets.length + promptSnippets.length} items saved
                    </p>
                </div>
                <Button asChild>
                    <Link href="/snippets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Snippet
                    </Link>
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={params.type || 'code'}>
                <TabsList>
                    <TabsTrigger value="code">
                        Code Snippets ({codeSnippets.length})
                    </TabsTrigger>
                    <TabsTrigger value="prompt">
                        AI Prompts ({promptSnippets.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="mt-6">
                    {codeSnippets.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {codeSnippets.map((snippet) => (
                                <SnippetCard key={snippet.id} snippet={snippet} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Code}
                            title="No code snippets yet"
                            description="Save your reusable code snippets here"
                            action={
                                <Button asChild>
                                    <Link href="/snippets/new">Create your first snippet</Link>
                                </Button>
                            }
                        />
                    )}
                </TabsContent>

                <TabsContent value="prompt" className="mt-6">
                    {promptSnippets.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {promptSnippets.map((snippet) => (
                                <SnippetCard key={snippet.id} snippet={snippet} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Code}
                            title="No AI prompts yet"
                            description="Save your favorite AI prompts here"
                            action={
                                <Button asChild>
                                    <Link href="/snippets/new">Create your first prompt</Link>
                                </Button>
                            }
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
