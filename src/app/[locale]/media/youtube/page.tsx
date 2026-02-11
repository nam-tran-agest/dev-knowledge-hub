import { getVideos, getPlaylists } from '@/features/media/services/youtube';
import { getTranslations } from 'next-intl/server';
import { YouTubeGallery } from '@/features/media/components/youtube/youtube-gallery';
import { PageShell } from '@/components/layout/page-shell';

export default async function YouTubePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.youtube' });
    const [videos, playlists] = await Promise.all([
        getVideos(),
        getPlaylists()
    ]);

    return (
        <PageShell className="bg-gradient-to-br from-[#0c1a36] via-[#204b8f] to-[#060f24]">
            <div className="py-8 sm:py-12 space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
                        {t('title')}
                    </h1>
                    <p className="text-slate-200 text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <YouTubeGallery videos={videos} playlists={playlists} />
            </div>
        </PageShell>
    );
}
