
import { getNotes, getNote } from '@/lib/actions/notes'
import { NoteList } from '@/components/notes/note-list'
import { NoteEditor } from '@/components/notes/note-editor'
import { cn } from '@/lib/utils'

interface NotePageProps {
    params: Promise<{ id: string; locale: string }>
}

const CATEGORY_THEMES: Record<string, { bg: string; border: string }> = {
    work: {
        bg: 'bg-blue-500/5',
        border: 'border-blue-500/20',
    },
    learn: {
        bg: 'bg-emerald-500/5',
        border: 'border-emerald-500/20',
    },
    ideas: {
        bg: 'bg-amber-500/5',
        border: 'border-amber-500/20',
    },
    life: {
        bg: 'bg-rose-500/5',
        border: 'border-rose-500/20',
    },
}

export default async function NotePage({ params }: NotePageProps) {
    const { id, locale } = await params

    // Check if id is a category (for list view) or a note ID
    const isCategory = Object.keys(CATEGORY_THEMES).includes(id)

    let categorySlug = 'work'
    let selectedNoteId: string | undefined
    let initialNoteData: any = null

    if (isCategory) {
        // If route is /notes/work, load list for work
        categorySlug = id
    } else {
        // If route is /notes/[uuid], fetch note to find its category
        const note = await getNote(id)
        if (note) {
            categorySlug = note.category?.slug || 'work'
            selectedNoteId = note.id as string
            initialNoteData = note
        }
    }

    // Fetch notes list for the sidebar
    const { data: notes } = await getNotes({ categorySlug })
    const theme = CATEGORY_THEMES[categorySlug] || CATEGORY_THEMES.work

    return (
        <div className="h-screen flex overflow-hidden pt-16">
            {/* Left Column - 30% */}
            <div className={cn("w-[30%] min-w-[300px] border-r", theme.bg)}>
                <NoteList
                    notes={notes}
                    selectedNoteId={selectedNoteId}
                    categorySlug={categorySlug}
                />
            </div>

            {/* Right Column - 70% */}
            <div className="flex-1 bg-background h-full overflow-hidden">
                {selectedNoteId && initialNoteData ? (
                    <NoteEditor note={initialNoteData} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <div className="p-4 rounded-full bg-muted/50">
                            <span className="text-4xl">📝</span>
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Select a note to view</h3>
                            <p className="text-sm">Or create a new one from the sidebar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
