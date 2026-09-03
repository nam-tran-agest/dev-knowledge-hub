'use client';

import React, { useEffect, useState } from 'react';
import { PlaylistContent } from '@/features/media/components/youtube/playlist-content';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ListVideo, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPlaylists, getPlaylistDetails, getVideos } from '@/features/media/services/youtube';
import { useTranslations } from 'next-intl';

interface YouTubePlaylistContainerProps {
    playlistId: string;
}

export function YouTubePlaylistContainer({ playlistId }: YouTubePlaylistContainerProps) {
    const t = useTranslations('media.youtube.playlist');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<{ playlist: any; videos: any[] } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [playlists, setPlaylists] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [libraryVideos, setLibraryVideos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadPlaylist() {
            try {
                setIsLoading(true);
                const [pDetails, allPlaylists, libVideos] = await Promise.all([
                    getPlaylistDetails(playlistId),
                    getPlaylists(),
                    getVideos()
                ]);

                if (!isMounted) return;
                setData(pDetails);
                setPlaylists(allPlaylists || []);
                setLibraryVideos(libVideos || []);
            } catch (err) {
                console.error('Failed to load YouTube playlist details:', err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadPlaylist();

        return () => {
            isMounted = false;
        };
    }, [playlistId]);

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent relative font-mono">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-wider animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span>// BUFFERING_PLAYLIST_STREAM...</span>
                    </div>
                    <div className="h-28 bg-surface/50 border border-primary/20 cyber-clip animate-pulse p-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-56 bg-surface/30 border border-primary/10 cyber-clip animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen pt-32 text-center font-mono space-y-4">
                <h1 className="text-xl text-white uppercase">// PLAYLIST_NOT_FOUND</h1>
                <Link href="/media/youtube" className="text-primary hover:underline text-xs">[ ← BACK_TO_YOUTUBE_HUB ]</Link>
            </div>
        );
    }

    const { playlist, videos } = data;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent relative">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Deck */}
                <div className="flex items-center gap-4 border-b border-primary/20 pb-6">
                    <Link href="/media/youtube">
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 cyber-clip-button border border-primary/30">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 cyber-clip-button bg-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                            <ListVideo className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase tracking-wider">
                                    {playlist.title}
                                </h1>
                                <span className="text-[9px] font-mono text-primary/60 px-1.5 py-0.5 border border-primary/30 cyber-clip-tag">
                                    // PLAYLIST_STREAM
                                </span>
                            </div>
                            <p className="text-primary/60 font-mono text-xs mt-0.5 uppercase">
                                // {t('videoCount', { count: videos.length })}
                            </p>
                        </div>
                    </div>
                </div>

                {playlist.description && (
                    <div className="max-w-3xl border-l-2 border-primary bg-primary/[0.04] p-3.5 cyber-clip-button">
                        <p className="text-primary/80 font-mono text-xs uppercase">// {playlist.description}</p>
                    </div>
                )}

                {videos.length === 0 && !playlist.description ? (
                    <div className="bg-surface/60 border border-dashed border-primary/25 cyber-clip p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
                        <div className="w-12 h-12 bg-primary/10 border border-primary/30 cyber-clip-button flex items-center justify-center mx-auto mb-3 text-primary">
                            <ListVideo className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-mono font-bold uppercase tracking-wider text-white mb-1">[ {t('empty')} ]</h3>
                        <p className="text-primary/60 font-mono text-xs mb-6 max-w-sm mx-auto uppercase">// {t('emptyDesc')}</p>
                        <div className="flex justify-center flex-col items-center gap-4">
                            <PlaylistContent
                                playlist={playlist}
                                videos={videos}
                                allPlaylists={playlists}
                                libraryVideos={libraryVideos || []}
                            />
                        </div>
                    </div>
                ) : (
                    <PlaylistContent
                        playlist={playlist}
                        videos={videos}
                        allPlaylists={playlists}
                        libraryVideos={libraryVideos || []}
                    />
                )}
            </div>
        </div>
    );
}
