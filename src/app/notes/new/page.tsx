import { getCategories, getTags } from '@/lib/actions/categories'
import { NoteForm } from '@/components/notes/note-form'

export default async function NewNotePage() {
    const [categories, tags] = await Promise.all([
        getCategories(),
        getTags(),
    ])

    return <NoteForm categories={categories} tags={tags} />
}
