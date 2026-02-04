import Link from 'next/link'
import { formatRelative } from '@/lib/utils/date'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import type { Note } from '@/types'
import { cn } from '@/lib/utils'
import { CC_STYLES } from '@/lib/constants'
import { CategoryBadge } from './category-badge'
import { NoteTags } from './note-tags'

interface NoteCardProps {
    note: Note
}

export function NoteCard({ note }: NoteCardProps) {
    return (
        <Link href={`/notes/${note.id}`}>
            <Card className={cn("h-full group hover:border-blue-500/30", CC_STYLES.card)}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2 text-gray-200 group-hover:text-blue-400 transition-colors">
                            {note.title}
                        </h3>
                        {note.category && <CategoryBadge category={note.category} />}
                    </div>
                </CardHeader>

                <CardContent className="pb-3">
                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                        {note.content || <span className="italic opacity-50">No content</span>}
                    </p>
                </CardContent>

                <CardFooter className="pt-0 flex items-center justify-between border-t border-white/5 mt-auto p-4">
                    <NoteTags tags={note.tags} limit={2} />
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FileText className="h-3 w-3" />
                        {note.updated_at ? formatRelative(note.updated_at) : 'No date'}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
