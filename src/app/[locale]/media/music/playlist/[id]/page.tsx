
import { getTranslations } from 'next-intl/server';
import { getPlaylist, getPlaylistTracks } from '@/lib/actions/spotify';
import { MusicSidebar } from '@/components/media/music/music-sidebar';
import { Link } from '@/i18n/routing';
import { ChevronLeft, Music2, Clock, Play, User } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpotifyPlaylistPageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default async function SpotifyPlaylistPage({ params }: SpotifyPlaylistPageProps) {
    const { locale, id } = await params;
    const t = await getTranslations({ locale, namespace: 'media.music' });

    const playlist = await getPlaylist(id);
    const tracks = await getPlaylistTracks(id);

    if (!playlist) {
        return (
            <div className="min-h-screen pt-32 bg-[#050505] text-center">
                <h1 className="text-2xl text-white">Playlist not found</h1>
                <Link href="/media/music" className="text-emerald-500 hover:underline">Back to Music</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-[#050505] flex flex-col">
            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
                <MusicSidebar currentCategory="playlists" />
                <main className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Header Hero */}
                        <div className="relative h-[300px] md:h-[400px] bg-gradient-to-b from-emerald-500/20 to-[#050505] p-8 md:p-12 flex flex-col md:flex-row items-end gap-8">
                            <Link href="/media/music?category=playlists" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/back z-20">
                                <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                                <span className="font-medium">{t('playlist.back')}</span>
                            </Link>

                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0">
                                {playlist.images?.[0]?.url ? (
                                    <Image src={playlist.images[0].url} alt={playlist.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                        <Music2 className="w-20 h-20 text-emerald-500" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4 pb-2">
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 uppercase tracking-wider text-[10px] font-bold">Playlist</Badge>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                                    {playlist.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold">
                                            {playlist.owner?.display_name?.[0]}
                                        </div>
                                        <span className="font-bold">{playlist.owner?.display_name}</span>
                                    </div>
                                    <span className="text-slate-500">•</span>
                                    <span>{playlist.tracks?.total} {t('playlist.songs')}</span>
                                    <span className="text-slate-500">•</span>
                                    <a
                                        href={playlist.external_urls?.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors"
                                    >
                                        {t('playlist.openSpotify')}
                                    </a>
                                </div>
                                {playlist.description && (
                                    <p className="text-slate-400 max-w-2xl line-clamp-2" dangerouslySetInnerHTML={{ __html: playlist.description }} />
                                )}
                            </div>
                        </div>

                        {/* Tracks List */}
                        <div className="p-8 md:p-12 max-w-7xl mx-auto -mt-4 transition-all">
                            <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-md">
                                <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 border-b border-white/5 text-slate-500 text-sm font-bold uppercase tracking-wider px-8">
                                    <div className="w-8 text-center">#</div>
                                    <div>Title</div>
                                    <div className="hidden md:block">Album</div>
                                    <div className="w-12 text-right"><Clock className="w-4 h-4 ml-auto" /></div>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {tracks.map((item: any, index: number) => {
                                        const track = item.track;
                                        if (!track) return null;
                                        const duration = formatDuration(track.duration_ms);

                                        return (
                                            <div key={track.id + index} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 hover:bg-white/5 transition-colors group px-8 items-center cursor-default">
                                                <div className="w-8 text-center text-slate-500 font-medium group-hover:text-emerald-500 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image src={track.album?.images?.[0]?.url} alt="" fill className="object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                                                            {track.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500 truncate">
                                                            {track.artists?.map((a: any) => a.name).join(', ')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block text-slate-400 text-sm truncate">
                                                    {track.album?.name}
                                                </div>
                                                <div className="w-12 text-right text-slate-500 text-sm font-medium">
                                                    {duration}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function formatDuration(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
}
