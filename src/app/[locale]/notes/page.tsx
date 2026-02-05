import { Suspense } from 'react'
import Link from 'next/link'
import { getNotes } from '@/lib/actions/notes'
import { getCategories, getTags } from '@/lib/actions/categories'
import { NoteCard, FilterBar } from '@/components/notes'
import { EmptyState } from '@/components/shared'
import { LoadingSkeleton } from '@/components/shared/loading-skeleton'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'

interface NotesPageProps {
    searchParams: Promise<{
        category?: string
        tag?: string
        search?: string
        page?: string
    }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
    const params = await searchParams
    const page = parseInt(params.page || '1', 10)
    const limit = 12
    const offset = (page - 1) * limit

    const [{ data: notes, count }, categories, tags] = await Promise.all([
        getNotes({
            categoryId: params.category,
            search: params.search,
            limit,
            offset,
        }),
        getCategories(),
        getTags(),
    ])

    const totalPages = Math.ceil((count || 0) / limit)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                    <p className="text-muted-foreground mt-1">
                        {count} note{count !== 1 ? 's' : ''} in your collection
                    </p>
                </div>
                <Button asChild>
                    <Link href="/notes/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Note
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <FilterBar
                categories={categories}
                tags={tags}
                selectedCategory={params.category}
                selectedTag={params.tag}
                searchQuery={params.search}
            />

            {/* Notes Grid */}
            <Suspense fallback={<LoadingSkeleton count={6} />}>
                {notes.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FileText}
                        title="No notes found"
                        description={
                            params.search
                                ? `No notes match "${params.search}"`
                                : "Start building your knowledge base"
                        }
                        action={
                            <Button asChild>
                                <Link href="/notes/new">Create your first note</Link>
                            </Button>
                        }
                    />
                )}
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            asChild
                        >
                            <Link
                                href={{
                                    pathname: '/notes',
                                    query: { ...params, page: p },
                                }}
                            >
                                {p}
                            </Link>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    )
}
