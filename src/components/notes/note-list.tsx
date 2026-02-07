
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Note } from '@/types/note'
import { Plus, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createNote } from '@/lib/actions/notes'

interface NoteListProps {
    notes: Note[]
    selectedNoteId?: string
    categorySlug: string
}

// Map category slugs to specific active styles
const CATEGORY_STYLES: Record<string, { activeBg: string; activeText: string; ringColor: string }> = {
    work: { activeBg: 'bg-blue-500', activeText: 'text-white', ringColor: 'text-blue-500' },
    learn: { activeBg: 'bg-emerald-500', activeText: 'text-white', ringColor: 'text-emerald-500' },
    ideas: { activeBg: 'bg-amber-500', activeText: 'text-white', ringColor: 'text-amber-500' },
    life: { activeBg: 'bg-rose-500', activeText: 'text-white', ringColor: 'text-rose-500' },
}

export function NoteList({ notes, selectedNoteId, categorySlug }: NoteListProps) {
    const theme = CATEGORY_STYLES[categorySlug] || CATEGORY_STYLES.work

    return (
        <div className="flex flex-col h-full bg-background border-r border-border/40">
            <div className="p-8 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 pb-4">
                <h2 className="font-bold text-gradient text-4xl tracking-tight">Notes</h2>
                <form action={async () => {
                    'use server'
                    await createNote({
                        title: 'New Idea',
                        content: '',
                        categorySlug: categorySlug,
                        tags: []
                    })
                }}>
                    <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-muted" type="submit" title="Create new note">
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
                                        ? cn(theme.activeBg, theme.activeText, "shadow-2xl scale-[1.02] ring-4 ring-white/20")
                                        : "bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm hover:shadow-md hover:bg-white hover:scale-[1.01]"
                                )}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className={cn(
                                            "font-bold text-lg line-clamp-1 leading-tight pr-4",
                                            !isActive && "text-gray-900"
                                        )}>
                                            {note.title || 'Untitled'}
                                        </h3>
                                        {/* Status Ring Indicator for Inactive only */}
                                        {!isActive && (
                                            <div className={cn("mt-1", theme.ringColor)}>
                                                <Circle className="h-3 w-3 fill-transparent stroke-[3px]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "text-sm line-clamp-2 leading-relaxed font-medium",
                                        isActive ? "text-white/90" : "text-gray-400"
                                    )}>
                                        {note.content || 'No additional text'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <span className={cn(
                                        "text-xs font-bold tracking-wide",
                                        isActive ? "text-white/80" : "text-gray-400"
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
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-lg font-medium">No notes created yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
