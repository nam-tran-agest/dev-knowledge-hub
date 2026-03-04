'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Type, Check, X, ChevronLeft } from 'lucide-react'
import type { Note } from '@/features/notes/types'
import { cn } from '@/lib/utils'
import { MarkdownViewer } from '@/components/ui/markdown-viewer'
import { NOTES_CONFIG } from '@/features/notes/constants/notes-config'
import { useNoteEditor } from '@/features/notes/hooks/use-note-editor'

interface NoteEditorProps {
    note: Note
}

export function NoteEditor({ note }: NoteEditorProps) {
    const config = NOTES_CONFIG[note.category?.slug || 'work'] || NOTES_CONFIG.work
    const {
        mode,
        setMode,
        title,
        setTitle,
        content,
        setContent,
        tags,
        setTags,
        saving,
        onSave,
        onDelete,
        router
    } = useNoteEditor(note)

    return (
        <div className="flex-1 w-full flex flex-col h-full relative group">

            {/* Mobile Header with Back Button */}
            <div className="md:hidden flex items-center p-4 border-b border-slate-200/50 bg-white/10 backdrop-blur-md">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/notes/${note.category?.slug || 'work'}`)}
                    className="text-slate-600 hover:text-slate-900"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </Button>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-auto p-4 md:p-12 custom-scrollbar bg-white/5">
                <div className="w-full space-y-6 md:space-y-8 pb-24">

                    {/* Header Region */}
                    <div className="space-y-6">
                        {mode === 'edit' ? (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-4xl md:text-5xl font-bold h-auto border-b border-black dark:border-white/10 focus:border-primary px-0 bg-transparent placeholder:text-muted/30 rounded-none mb-2 text-slate-900 dark:text-slate-900"
                                    placeholder="Untitled Note"
                                />
                                <Input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="text-base text-primary font-medium h-auto border-b border-black dark:border-white/10 focus:border-primary px-0 bg-transparent rounded-none text-slate-900 dark:text-slate-900"
                                    placeholder="#tags..."
                                />
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950">
                                    {title || 'Untitled'}
                                </h1>
                                {tags && (
                                    <div className={cn("flex flex-wrap gap-2 font-semibold", config.accentClass)}>
                                        {tags.split(',').filter(Boolean).map(t => (
                                            <span key={t}>#{t.trim()}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Content Region */}
                    <div className="min-h-[400px]">
                        {mode === 'edit' ? (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Start writing your thoughts..."
                                className="w-full h-[60vh] font-sans text-lg leading-relaxed border border-black dark:border-white/10 shadow-sm focus-visible:ring-1 focus-visible:ring-primary/50 resize-none p-6 bg-transparent rounded-xl text-slate-900 dark:text-slate-900"
                            />
                        ) : (
                            <MarkdownViewer content={content} accentBorder={config.accentBorder} accentClass={config.accentClass} />
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-8 right-8 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                {mode === 'edit' ? (
                    <>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => setMode('view')}
                            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
                            title="Cancel"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={onSave}
                            disabled={saving}
                            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-slate-950 text-white"
                            title="Save Changes"
                        >
                            {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="h-6 w-6" />}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={onDelete}
                            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                            title="Delete Note"
                        >
                            <Trash2 className="h-6 w-6" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => setMode('edit')}
                            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-white/80 border border-slate-200/50 text-slate-900"
                            title="Edit Note"
                        >
                            <Type className="h-6 w-6" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
