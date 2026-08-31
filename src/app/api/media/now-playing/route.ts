import { NextResponse } from 'next/server';
import { getUserSteamId, getSteamPlayerSummary } from '@/features/media/lib/steam-client';
import { getSpotifyAuthToken } from '@/features/media/services/spotify';
import { spotifyFetch, type SpotifyCurrentlyPlaying } from '@/features/media/services/spotify-api';

export async function GET() {
    try {
        // Fetch Steam and Spotify concurrently
        const [steamId, spotifyToken] = await Promise.all([
            getUserSteamId(),
            getSpotifyAuthToken()
        ]);

        let steamData = null;
        if (steamId) {
            const player = await getSteamPlayerSummary();
            if (player) {
                steamData = {
                    personaname: player.personaname,
                    avatar: player.avatarfull,
                    state: player.personastate,
                    game: player.gameextrainfo || null,
                    gameId: player.gameid || null
                };
            }
        }

        let spotifyData = null;
        if (spotifyToken) {
            const currentTrack = (await spotifyFetch('me/player/currently-playing', spotifyToken)) as SpotifyCurrentlyPlaying | null;
            if (currentTrack && currentTrack.item) {
                spotifyData = {
                    isPlaying: currentTrack.is_playing,
                    songName: currentTrack.item.name,
                    artistName: currentTrack.item.artists?.map(a => a.name).join(', '),
                    albumArt: currentTrack.item.album?.images?.[0]?.url,
                    progress_ms: currentTrack.progress_ms,
                    duration_ms: currentTrack.item.duration_ms
                };
            }
        }

        return NextResponse.json({
            steam: steamData,
            spotify: spotifyData
        });

    } catch (error) {
        console.error('Now Playing API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 });
    }
}
