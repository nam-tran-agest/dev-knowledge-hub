import { getVideos, getPlaylists } from '@/features/media/services/youtube';
import { getTranslations } from 'next-intl/server';
import { YouTubeGallery } from '@/features/media/components/youtube/youtube-gallery';

interface YouTubeContainerProps {
    locale: string;
}

export async function YouTubeContainer({ locale }: YouTubeContainerProps) {
    const t = await getTranslations({ locale, namespace: 'media.youtube' });
    const [videos, playlists] = await Promise.all([
        getVideos(),
        getPlaylists()
    ]);

    return (
        <div className="py-6 sm:py-10 space-y-6 font-mono">
            <div className="text-center space-y-2 border-b border-primary/20 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 cyber-clip-tag text-[10px] uppercase text-primary tracking-widest">
                    // VIDEO_TELEMETRY_STREAM
                </div>
                <h1 className="text-2xl sm:text-4xl font-mono font-bold uppercase tracking-wider text-white">
                    {t('title')}
                </h1>
                <p className="text-primary/60 text-xs sm:text-sm max-w-2xl mx-auto uppercase">
                    // {t('subtitle')}
                </p>
            </div>

            <YouTubeGallery videos={videos} playlists={playlists} />
        </div>
    );
}
