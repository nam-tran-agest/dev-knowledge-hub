import { PageShell } from '@/components/layout/page-shell';
import { YouTubeContainer } from '@/features/media';

export default async function YouTubePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <PageShell className="bg-transparent">
            <YouTubeContainer locale={locale} />
        </PageShell>
    );
}
