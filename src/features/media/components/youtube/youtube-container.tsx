'use client';

import React, { useEffect, useState } from 'react';
import { getVideos, getPlaylists } from '@/features/media/services/youtube';
import { YouTubeGallery } from '@/features/media/components/youtube/youtube-gallery';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import type { SavedVideo, SavedPlaylist } from '@/features/media/types/youtube';

interface YouTubeContainerProps {
    locale: string;
}

export function YouTubeContainer({ locale: _locale }: YouTubeContainerProps) {
    const t = useTranslations('media.youtube');
    const [videos, setVideos] = useState<SavedVideo[]>([]);
    const [playlists, setPlaylists] = useState<SavedPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadMedia() {
            try {
                setIsLoading(true);
                const [vData, pData] = await Promise.all([
                    getVideos(),
                    getPlaylists()
                ]);
                if (!isMounted) return;
                setVideos((vData || []) as unknown as SavedVideo[]);
                setPlaylists((pData || []) as unknown as SavedPlaylist[]);
            } catch (err) {
                console.error('Failed to load YouTube telemetry:', err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadMedia();

        return () => {
            isMounted = false;
        };
    }, []);

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

            {isLoading ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-2 text-primary font-mono text-xs uppercase tracking-wider animate-pulse py-8">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>// ACCESSING_VIDEO_ARCHIVES...</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-64 bg-surface-deep/40 border border-primary/15 cyber-clip-button animate-pulse p-4 flex flex-col justify-between">
                                <div className="h-36 bg-primary/10 border border-primary/20 cyber-clip" />
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 bg-primary/10" />
                                    <div className="h-3 w-1/2 bg-primary/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <YouTubeGallery videos={videos} playlists={playlists} />
            )}
        </div>
    );
}
