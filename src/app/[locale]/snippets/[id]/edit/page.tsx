import { notFound } from 'next/navigation'
import { getSnippet } from '@/lib/actions/snippets'
import EditSnippetForm from '@/components/snippets/snippet-form'

interface EditSnippetPageProps {
    params: Promise<{ id: string }>
}

export default async function EditSnippetPage({ params }: EditSnippetPageProps) {
    const { id } = await params
    const snippet = await getSnippet(id)

    if (!snippet) {
        notFound()
    }

    return <EditSnippetForm snippet={snippet} />
}
