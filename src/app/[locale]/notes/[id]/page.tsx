import { PageShell } from '@/components/layout/page-shell';
import { NoteContainer } from '@/features/notes/components/note-container';

interface NotePageProps {
    params: Promise<{ id: string }>
}

export default async function NotePage({ params }: NotePageProps) {
    const { id } = await params

    return (
        <PageShell variant="landing">
            <NoteContainer id={id} />
        </PageShell>
    )
}
