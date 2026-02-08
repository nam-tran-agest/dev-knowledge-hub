
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Save,
    Trash2,
    Plus,
    Type,
    Check,
    X,
    ChevronLeft
} from 'lucide-react'
import { updateNote, deleteNote } from '@/lib/actions/notes'
import type { Note } from '@/types/note'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// @ts-expect-error - no types available for remark-breaks
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { NOTES_CONFIG } from '@/lib/constants/notes-config'

interface NoteEditorProps {
    note: Note
}

export function NoteEditor({ note }: NoteEditorProps) {
    const router = useRouter()
    const config = NOTES_CONFIG[note.category?.slug || 'work'] || NOTES_CONFIG.work
    const [mode, setMode] = useState<'view' | 'edit'>('view')
    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content || '')
    const [tags, setTags] = useState(note.tags?.join(', ') || '')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setTitle(note.title)
        setContent(note.content || '')
        setTags(note.tags?.join(', ') || '')
        setMode('view')
    }, [note.id, note.title, note.content, note.tags])

    async function onSave() {
        setSaving(true)
        try {
            await updateNote(String(note.id), {
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            })
            setMode('view')
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    async function onDelete() {
        if (!confirm('Are you sure you want to delete this note?')) return
        try {
            await deleteNote(String(note.id))
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

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
                            <div className="prose prose-lg max-w-none text-slate-900 leading-relaxed border border-transparent p-4 md:p-6 rounded-xl min-h-[60vh]">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    {...props}
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="rounded-xl !bg-slate-900 !p-6 !my-6 shadow-sm"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code {...props} className={cn("bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm", config.accentClass, className)}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-10 mb-5" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-8 mb-4" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-6 text-slate-800 leading-relaxed" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className={cn("border-l-4 pl-6 italic text-lg my-8 text-slate-600", config.accentBorder)} {...props} />,
                                    }}
                                >
                                    {content}
                                </ReactMarkdown>
                            </div>
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
