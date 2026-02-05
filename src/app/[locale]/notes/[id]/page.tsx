

interface NotePageProps {
    params: Promise<{ id: string; locale: string }>
    searchParams: Promise<{
        tag?: string
        search?: string
        page?: string
    }>
}

export default async function NotePage({ params, searchParams }: NotePageProps) {
    const { id, locale } = await params
    const sParams = await searchParams

    return (
        <div>
            <h1>Note Page</h1>
        </div>
    )
}
