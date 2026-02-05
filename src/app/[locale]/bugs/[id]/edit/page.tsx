import { notFound } from 'next/navigation'
import { getBug } from '@/lib/actions/bugs'
import EditBugForm from '@/components/bugs/bug-form'

interface EditBugPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBugPage({ params }: EditBugPageProps) {
    const { id } = await params
    const bug = await getBug(id)

    if (!bug) {
        notFound()
    }

    return <EditBugForm bug={bug} />
}
