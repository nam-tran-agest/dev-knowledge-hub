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
            <div className="p-6 flex items-center justify-between sticky top-0 bg-[#07090e]/80 backdrop-blur-xl z-10 border-b border-white/10">
                <h2 className={cn("font-bold text-transparent bg-clip-text text-3xl tracking-tight bg-gradient-to-r", config.headingGradient)}>Notes</h2>
                <form action={async () => {
                    'use server'
                    await createNote({
                        title: 'New Idea',
                        content: '',
                        categorySlug: categorySlug,
                        tags: []
                    })
                }}>
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-white" type="submit" title="Create new note">
                        <Plus className="h-5 w-5" />
                    </Button>
                </form>
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="flex flex-col gap-3">
                    {notes.map((note) => {
                        const isActive = selectedNoteId === String(note.id)

                        return (
                            <Link
                                key={note.id}
                                href={`/notes/${note.id}`}
                                className={cn(
                                    "relative flex flex-col gap-2.5 p-5 rounded-2xl transition-all duration-300 text-left group",
                                    isActive
                                        ? cn(config.activeClass, "scale-[1.01]")
                                        : "bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/[0.06]"
                                )}
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-start justify-between">
                                        <h3 className={cn(
                                            "font-bold text-base line-clamp-1 leading-tight pr-2 transition-colors",
                                            isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                                        )}>
                                            {note.title || 'Untitled'}
                                        </h3>
                                        {!isActive && (
                                            <div className={cn("mt-0.5", config.accentClass)}>
                                                <Circle className="h-2.5 w-2.5 fill-current" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "text-xs line-clamp-2 leading-relaxed transition-colors",
                                        isActive ? "text-white/80" : "text-slate-400 group-hover:text-slate-300"
                                    )}>
                                        {note.content || 'No additional text'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className={cn(
                                        "text-[11px] font-mono transition-colors",
                                        isActive ? "text-white/70" : "text-slate-500 group-hover:text-slate-400"
                                    )}>
                                        {note.tags && note.tags.length > 0 ? (
                                            note.tags.slice(0, 3).map(t => `#${t}`).join(' ')
                                        ) : (
                                            <span>{format(new Date(note.updated_at || new Date()), 'd MMM yyyy')}</span>
                                        )}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                    {notes.length === 0 && (
                        <div className="text-center py-12 text-slate-500 text-sm">
                            <p>No notes created yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
