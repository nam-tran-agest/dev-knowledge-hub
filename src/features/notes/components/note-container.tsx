import { getNotes, getNote } from '@/features/notes/services/notes'
import { NoteList } from '@/features/notes/components/note-list'
import { NoteEditor } from '@/features/notes/components/note-editor'
import { cn } from '@/lib/utils'
import type { Note } from '@/features/notes/types'
import { NOTES_CONFIG } from '@/features/notes/constants/notes-config'
import { FileText } from 'lucide-react'

interface NoteContainerProps {
    id: string
    initialEditMode?: boolean
}

export async function NoteContainer({ id, initialEditMode }: NoteContainerProps) {
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
        <div className={cn("flex flex-col pt-16 transition-colors duration-500 min-h-screen text-slate-200", config.gradient)}>
            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
                {/* Left Column - Note List */}
                <aside className={cn(
                    "w-full lg:w-84 shrink-0 border-b lg:border-r border-white/10 backdrop-blur-2xl flex flex-col bg-[#0a0e17]/60",
                    selectedNoteId ? "hidden lg:flex" : "flex"
                )}>
                    <NoteList
                        notes={notes}
                        selectedNoteId={selectedNoteId}
                        categorySlug={categorySlug}
                    />
                </aside>

                {/* Right Column - Note Editor / Empty State */}
                <main className="flex-1 bg-transparent min-w-0 flex flex-col">
                    {selectedNoteId && initialNoteData ? (
                        <NoteEditor note={initialNoteData} initialEditMode={initialEditMode} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
                            <div className={cn("p-6 rounded-3xl backdrop-blur-xl shadow-2xl", config.iconBg)}>
                                <FileText className={cn("w-12 h-12", config.accentClass)} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-2xl text-white tracking-tight">Select a note to view</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Choose a thought from the list or create a new note to start writing.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
