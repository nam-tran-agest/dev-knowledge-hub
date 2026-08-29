import { MusicSidebar } from '@/features/media/components/music/music-sidebar';
import { MusicGrid } from '@/features/media/components/music/music-grid';
import { getSpotifyAuthToken, getTopTracks, getTopArtists, getUserPlaylists } from '@/features/media/services/spotify';
import { getSpotifyAuthUrl } from '@/features/media/services/spotify-api';
import { Button } from '@/components/ui/button';
import { Music2, Radio } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';

interface MusicContainerProps {
    category: string;
}

export async function MusicContainer({ category }: MusicContainerProps) {
    const token = await getSpotifyAuthToken();
    const authUrl = getSpotifyAuthUrl();

    if (!token) {
        return (
            <PageShell variant="landing" className="bg-background flex flex-col items-center justify-center p-6 space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
                <div className="p-6 cyber-clip-lg bg-primary/10 border border-primary/40 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
                    <Music2 className="h-16 w-16 text-primary animate-pulse" />
                </div>
                <div className="text-center space-y-3 max-w-md">
                    <h1 className="text-2xl sm:text-3xl font-mono font-extrabold uppercase tracking-wider text-white">
                        INITIALIZE_AUDIO_BRIDGE
                    </h1>
                    <p className="text-primary/60 font-mono text-xs uppercase leading-relaxed">
                        // Authorize Spotify telemetry stream to index top tracks, artists, and playlists directly into your HUD.
                    </p>
                </div>
                <Button asChild className="bg-primary text-black font-mono font-bold uppercase tracking-wider h-12 px-8 cyber-clip-button shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/90 cursor-pointer">
                    <a href={authUrl}>[ CONNECT_SPOTIFY_TOKEN ]</a>
                </Button>
            </PageShell>
        );
    }

    let data = [];
    let title = '';

    switch (category) {
        case 'top-artists':
            data = await getTopArtists(20);
            title = 'TOP_ARTISTS';
            break;
        case 'playlists':
            data = await getUserPlaylists(20);
            title = 'ACTIVE_PLAYLISTS';
            break;
        default:
            data = await getTopTracks(20);
            title = 'TOP_AUDIO_TRACKS';
    }

    return (
        <PageShell variant="landing" className="bg-background flex flex-col">
            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">
                <MusicSidebar currentCategory={category} />
                <main className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
                            <div className="border-b border-primary/20 pb-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
                                        <span className="text-[10px] font-mono text-primary/60 uppercase tracking-widest">// AUDIO_STREAM_BUFFER</span>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase tracking-wider">{title}</h1>
                                </div>
                            </div>
                            <MusicGrid items={data} type={category as 'top-tracks' | 'top-artists' | 'playlists'} />
                        </div>
                    </div>
                </main>
            </div>
        </PageShell>
    );
}
