'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { Note as NoteType } from '@/types'
import { deleteNote } from '@/lib/actions/notes'
import { SPACING } from '@/lib/constants/styles'
import { CategoryBadge } from './category-badge'
import { NoteTags } from './note-tags'
import Editor from './editor'

interface NoteDetailProps {
    note: NoteType
}

export function NoteDetail({ note }: NoteDetailProps) {
    return (
        <div className={SPACING.md}>
            {/* Header */}
            <div className="flex-between gap-4">
                <div className="flex-start gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/notes">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="form-field">
                        <h1 className="text-3xl font-bold">{note.title}</h1>
                        <div className="flex-center gap-4 text-sm text-muted-foreground">
                            <span className="flex-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {note.created_at ? formatDate(note.created_at) : 'No date'}
                            </span>
                            {note.category && <CategoryBadge category={note.category} />}
                        </div>
                        <NoteTags tags={note.tags} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/notes/${note.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <form
                        action={async () => {
                            await deleteNote(String(note.id))
                        }}
                    >
                        <Button variant="destructive" type="submit">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </form>
                </div>
            </div>

            {/* Content */}
            <Card className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                    {note.content ? (
                        <div className="prose dark:prose-invert max-w-none">
                            <Editor
                                initialContent={note.content}
                                editable={false}
                            />
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No content yet...</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
