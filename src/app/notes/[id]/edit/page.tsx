import { notFound } from 'next/navigation'
import { getNote } from '@/lib/actions/notes'
import { getCategories, getTags } from '@/lib/actions/categories'
import { NoteForm } from '@/components/notes/note-form'

interface EditNotePageProps {
    params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
    const { id } = await params

    // Fetch all necessary data in parallel
    const [note, categories, tags] = await Promise.all([
        getNote(id),
        getCategories(),
        getTags()
    ])

    if (!note) {
        notFound()
    }

    return (
        <div className="container mx-auto py-8">
            <NoteForm
                categories={categories}
                tags={tags}
                note={note}
            />
        </div>
    )
}
