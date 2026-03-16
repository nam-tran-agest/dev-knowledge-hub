import { PageShell } from '@/components/layout/page-shell';
import { NoteContainer } from '@/features/notes/components/note-container';

interface NotePageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ edit?: string }>
}

export default async function NotePage({ params, searchParams }: NotePageProps) {
    const { id } = await params
    const { edit } = await searchParams

    return (
        <PageShell variant="landing">
            <NoteContainer id={id} initialEditMode={edit === 'true'} />
        </PageShell>
    )
}
