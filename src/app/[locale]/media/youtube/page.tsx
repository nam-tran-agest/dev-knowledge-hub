import { PageShell } from '@/components/layout/page-shell';
import { YouTubeContainer } from '@/features/media/components/youtube/youtube-container';

export default async function YouTubePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <PageShell className="bg-gradient-to-br from-[#0c1a36] via-[#204b8f] to-[#060f24]">
            <YouTubeContainer locale={locale} />
        </PageShell>
    );
}
