import { getVideos, getPlaylists } from '@/lib/actions/youtube';
import { getTranslations } from 'next-intl/server';
import { YouTubeGallery } from '@/components/media/youtube/youtube-gallery';

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
        <div className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0c1a36] via-[#204b8f] to-[#060f24]">
            <div className="max-w-7xl mx-auto space-y-8">
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
        </div>
    );
}
