import { MusicSidebar } from '@/features/media/components/music/music-sidebar';
import { MusicGrid } from '@/features/media/components/music/music-grid';
import { getSpotifyAuthToken, getTopTracks, getTopArtists, getUserPlaylists } from '@/features/media/services/spotify';
import { getSpotifyAuthUrl } from '@/features/media/services/spotify-api';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';

interface MusicContainerProps {
    category: string;
}

export async function MusicContainer({ category }: MusicContainerProps) {
    const token = await getSpotifyAuthToken();
    const authUrl = getSpotifyAuthUrl();

    if (!token) {
        return (
            <PageShell variant="landing" className="bg-[#050505] flex flex-col items-center justify-center p-6 space-y-8">
                <div className="p-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                    <Music2 className="h-20 w-20 text-emerald-500 animate-pulse" />
                </div>
                <div className="text-center space-y-4 max-w-md">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Connect Your Music</h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Authorize with Spotify to view your top tracks, favorite artists, and personal playlists directly in your dashboard.
                    </p>
                </div>
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold h-14 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20">
                    <a href={authUrl}>Connect Spotify</a>
                </Button>
            </PageShell>
        );
    }

    let data = [];
    let title = '';

    switch (category) {
        case 'top-artists':
            data = await getTopArtists(20);
            title = 'Top Artists';
            break;
        case 'playlists':
            data = await getUserPlaylists(20);
            title = 'Your Playlists';
            break;
        default:
            data = await getTopTracks(20);
            title = 'Top Tracks';
    }

    return (
        <PageShell variant="landing" className="bg-[#050505] flex flex-col">
            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
                <MusicSidebar currentCategory={category} />
                <main className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-8 md:p-12 space-y-8 max-w-7xl mx-auto">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                                <p className="text-slate-500">Your personal selection from Spotify</p>
                            </div>
                            <MusicGrid items={data} type={category as 'top-tracks' | 'top-artists' | 'playlists'} />
                        </div>
                    </div>
                </main>
            </div>
        </PageShell>
    );
}
