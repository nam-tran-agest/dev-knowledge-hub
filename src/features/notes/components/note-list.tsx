
import Link from 'next/link'
import { NOTES_CONFIG } from '@/features/notes/constants/notes-config'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Note } from '@/features/notes/types'
import { Plus, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createNote } from '@/features/notes/services/notes'

interface NoteListProps {
    notes: Note[]
    selectedNoteId?: string
    categorySlug: string
}


export function NoteList({ notes, selectedNoteId, categorySlug }: NoteListProps) {
    const config = NOTES_CONFIG[categorySlug] || NOTES_CONFIG.work

    return (
        <div className="flex flex-col h-full bg-transparent">
            <div className="p-8 flex items-center justify-between sticky top-0 bg-white/20 backdrop-blur-xl z-10 pb-4">
                <h2 className={cn("font-bold text-transparent bg-clip-text text-4xl tracking-tight bg-gradient-to-r", config.headingGradient)}>Notes</h2>
                <form action={async () => {
                    'use server'
                    await createNote({
                        title: 'New Idea',
                        content: '',
                        categorySlug: categorySlug,
                        tags: []
                    })
                }}>
                    <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-black/5 text-slate-700" type="submit" title="Create new note">
                        <Plus className="h-6 w-6" />
                    </Button>
                </form>
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6 custom-scrollbar">
                <div className="flex flex-col gap-4">
                    {notes.map((note) => {
                        const isActive = selectedNoteId === String(note.id)

                        return (
                            <Link
                                key={note.id}
                                href={`/notes/${note.id}`}
                                className={cn(
                                    "relative flex flex-col gap-3 p-6 rounded-[32px] transition-all duration-300 text-left group",
                                    isActive
                                        ? cn(config.activeClass, "border-transparent scale-[1.02] shadow-lg")
                                        : "bg-white/40 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-white/60 hover:scale-[1.01]"
                                )}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className={cn(
                                            "font-bold text-lg line-clamp-1 leading-tight pr-4 transition-colors",
                                            isActive ? "text-white" : "text-slate-900 group-hover:text-black"
                                        )}>
                                            {note.title || 'Untitled'}
                                        </h3>
                                        {/* Status Ring Indicator for Inactive only */}
                                        {!isActive && (
                                            <div className={cn("mt-1", config.accentClass)}>
                                                <Circle className="h-3 w-3 fill-transparent stroke-[3px]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "text-sm line-clamp-2 leading-relaxed font-medium transition-colors",
                                        isActive ? "text-white/90" : "text-slate-600 group-hover:text-slate-800"
                                    )}>
                                        {note.content || 'No additional text'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <span className={cn(
                                        "text-xs font-bold tracking-wide transition-colors",
                                        isActive ? "text-white/80" : "text-slate-500 group-hover:text-slate-700"
                                    )}>
                                        {note.tags && note.tags.length > 0 ? (
                                            note.tags.slice(0, 3).map(t => `#${t}`).join(' ')
                                        ) : (
                                            <span>{format(new Date(note.updated_at || new Date()), 'd MMM')}</span>
                                        )}
                                    </span>

                                    {isActive && (
                                        <div className="flex -space-x-2">
                                            {/* Simulated avatars matching design */}
                                            <div className="h-6 w-6 rounded-full bg-white/20 border border-white/10" />
                                            <div className="h-6 w-6 rounded-full bg-white/30 border border-white/10" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                    {notes.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p className="text-lg font-medium">No notes created yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
