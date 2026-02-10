import { getNotes, getNote } from '@/lib/actions/notes'
import { NoteList } from '@/components/notes/note-list'
import { NoteEditor } from '@/components/notes/note-editor'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'

interface NotePageProps {
    params: Promise<{ id: string }>
}

import { NOTES_CONFIG } from '@/lib/constants/notes-config'

export default async function NotePage({ params }: NotePageProps) {
    const { id } = await params

    // Check if id is a category (for list view) or a note ID
    const isCategory = Object.keys(NOTES_CONFIG).includes(id)

    let categorySlug = 'work'
    let selectedNoteId: string | undefined
    let initialNoteData: Note | null = null

    if (isCategory) {
        categorySlug = id
    } else {
        const note = await getNote(id)
        if (note) {
            categorySlug = note.category?.slug || 'work'
            selectedNoteId = note.id as string
            initialNoteData = note
        }
    }

    const { data: notes } = await getNotes({ categorySlug })
    const config = NOTES_CONFIG[categorySlug] || NOTES_CONFIG.work

    return (
        <div className={cn("min-h-screen flex flex-col pt-16 transition-colors duration-500", config.gradient)}>
            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Column - Note List */}
                <aside className={cn(
                    "w-full lg:w-80 shrink-0 border-b lg:border-r border-slate-200/50 backdrop-blur-xl flex flex-col",
                    config.bg,
                    selectedNoteId ? "hidden lg:flex" : "flex"
                )}>
                    <NoteList
                        notes={notes}
                        selectedNoteId={selectedNoteId}
                        categorySlug={categorySlug}
                    />
                </aside>

                {/* Right Column - Note Editor / Empty State */}
                <main className={cn(
                    "flex-1 bg-transparent min-w-0 flex flex-col",
                    selectedNoteId ? "flex" : "hidden lg:flex"
                )}>
                    {selectedNoteId && initialNoteData ? (
                        <NoteEditor note={initialNoteData} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                            <div className={cn("p-6 rounded-full backdrop-blur-md border border-slate-200/50 shadow-sm", config.iconBg)}>
                                <span className="text-5xl animate-bounce">📝</span>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-2xl text-slate-900 tracking-tight">Select a note to view</h3>
                                <p className="text-slate-500 max-w-sm">Choose a thought from the list or create a new one to get started.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
