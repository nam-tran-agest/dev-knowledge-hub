import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PlaylistContent } from '@/features/media/components/youtube/playlist-content';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ListVideo } from 'lucide-react';
import Link from 'next/link';
import { getPlaylists } from '@/features/media/services/youtube';
import { getTranslations } from 'next-intl/server';

interface YouTubePlaylistContainerProps {
    playlistId: string;
}

async function getPlaylistVideos(playlistId: string) {
    const supabase = await createClient();

    // Fetch playlist details
    const { data: playlist, error: pError } = await supabase
        .from('youtube_playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

    if (pError || !playlist) return null;

    // Fetch videos in this playlist
    const { data: items, error: iError } = await supabase
        .from('youtube_playlist_items')
        .select(`
            *,
            video:youtube_videos(*)
        `)
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true });

    if (iError) {
        console.error('Error fetching playlist items:', iError);
        return { playlist, videos: [] };
    }

    return {
        playlist,
        videos: (items || []).map(item => item.video).filter(Boolean)
    };
}

export async function YouTubePlaylistContainer({ playlistId }: YouTubePlaylistContainerProps) {
    const t = await getTranslations('media.youtube.playlist');
    const data = await getPlaylistVideos(playlistId);
    const playlists = await getPlaylists();
    const supabase = await createClient();
    const { data: libraryVideos } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });

    if (!data) {
        notFound();
    }

    const { playlist, videos } = data;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0c1a36] via-[#204b8f] to-[#060f24]">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Link href="/media/youtube">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                            <ListVideo className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white leading-tight">
                                {playlist.title}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {t('videoCount', { count: videos.length })}
                            </p>
                        </div>
                    </div>
                </div>

                {playlist.description && (
                    <div className="max-w-3xl border-l-4 border-red-600 bg-white/5 p-4 rounded-r-lg">
                        <p className="text-gray-300 italic">{playlist.description}</p>
                    </div>
                )}

                {videos.length === 0 && !playlist.description ? (
                    <div className="bg-slate-900/30 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ListVideo className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{t('empty')}</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">{t('emptyDesc')}</p>
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
