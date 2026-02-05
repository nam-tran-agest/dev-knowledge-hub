import { notFound } from 'next/navigation'
import { getNote } from '@/lib/actions/notes'
import { NoteDetail } from '@/components/notes/note-detail'

interface NoteDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
    const { id } = await params
    const note = await getNote(id)

    if (!note) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto">
            <NoteDetail note={note} />
        </div>
    )
}
