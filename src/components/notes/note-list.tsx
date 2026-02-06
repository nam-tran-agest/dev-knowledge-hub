
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Note } from '@/types/note'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createNote } from '@/lib/actions/notes'

interface NoteListProps {
    notes: Note[]
    selectedNoteId?: string
    categorySlug: string
}

// Map category slugs to specific active styles
const CATEGORY_STYLES: Record<string, { activeBg: string; activeText: string; lightBg: string }> = {
    work: { activeBg: 'bg-blue-500', activeText: 'text-white', lightBg: 'hover:bg-blue-50' },
    learn: { activeBg: 'bg-emerald-500', activeText: 'text-white', lightBg: 'hover:bg-emerald-50' },
    ideas: { activeBg: 'bg-amber-500', activeText: 'text-white', lightBg: 'hover:bg-amber-50' },
    life: { activeBg: 'bg-rose-500', activeText: 'text-white', lightBg: 'hover:bg-rose-50' },
}

export function NoteList({ notes, selectedNoteId, categorySlug }: NoteListProps) {
    const theme = CATEGORY_STYLES[categorySlug] || CATEGORY_STYLES.work

    return (
        <div className="flex flex-col h-full bg-background/50 backdrop-blur-xl border-r border-border/40">
            <div className="p-6 flex items-center justify-between sticky top-0 bg-transparent z-10">
                <h2 className="font-bold text-2xl capitalize tracking-tight">{categorySlug}</h2>
                <form action={async () => {
                    'use server'
                    await createNote({
                        title: 'New Idea',
                        content: '',
                        categorySlug: categorySlug,
                        tags: []
                    })
                }}>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-muted" type="submit" title="Quick Add">
                        <Plus className="h-5 w-5" />
                    </Button>
                </form>
            </div>
            <div className="flex-1 overflow-auto px-4 pb-4">
                <div className="flex flex-col gap-2">
                    {notes.map((note) => {
                        const isActive = selectedNoteId === String(note.id)

                        return (
                            <Link
                                key={note.id}
                                href={`/notes/${note.id}`}
                                className={cn(
                                    "flex flex-col gap-3 p-5 rounded-[24px] transition-all duration-200 text-left group",
                                    isActive
                                        ? cn(theme.activeBg, theme.activeText, "shadow-lg scale-[1.02]")
                                        : cn("bg-card/40 hover:scale-[1.01]", theme.lightBg)
                                )}
                            >
                                <div className="space-y-1">
                                    <h3 className={cn(
                                        "font-bold text-base line-clamp-2 leading-tight",
                                        !isActive && "text-foreground"
                                    )}>
                                        {note.title || 'Untitled Note'}
                                    </h3>

                                    <div className={cn(
                                        "text-sm line-clamp-3 leading-relaxed",
                                        isActive ? "text-white/90" : "text-muted-foreground"
                                    )}>
                                        {note.content || 'No content...'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className={cn(
                                        "text-xs font-medium",
                                        isActive ? "text-white/80" : "text-muted-foreground"
                                    )}>
                                        {note.tags && note.tags.length > 0 ? (
                                            <span>{note.tags.slice(0, 3).map(t => `#${t}`).join(' ')}</span>
                                        ) : (
                                            <span>{format(new Date(note.updated_at || new Date()), 'd MMM')}</span>
                                        )}
                                    </span>

                                    {/* Optional: Add a small avatar or icon here if needed as per design */}
                                </div>
                            </Link>
                        )
                    })}
                    {notes.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-lg">Nothing here yet</p>
                            <p className="text-sm opacity-60">Create a new note to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
