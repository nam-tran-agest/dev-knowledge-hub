import { NextResponse } from 'next/server';
import { getUserSteamId, getSteamPlayerSummary, getSteamRecentlyPlayed } from '@/features/media/lib/steam-client';
import { getSpotifyAuthToken } from '@/features/media/services/spotify';
import { spotifyFetch, type SpotifyCurrentlyPlaying } from '@/features/media/services/spotify-api';

// Short TTL memory cache to prevent hammering external APIs on high frequency polling
let memoryCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL_MS = 5000; // 5 seconds

export async function GET() {
    try {
        const now = Date.now();
        if (memoryCache && (now - memoryCache.timestamp < CACHE_TTL_MS)) {
            return NextResponse.json(memoryCache.data, {
                headers: {
                    'Cache-Control': 'public, max-age=5, s-maxage=5, stale-while-revalidate=10'
                }
            });
        }

        // Fetch Steam and Spotify concurrently
        const [steamId, spotifyToken] = await Promise.all([
            getUserSteamId(),
            getSpotifyAuthToken()
        ]);

        let steamData = null;
        if (steamId) {
            const [player, recentGames] = await Promise.all([
                getSteamPlayerSummary(),
                getSteamRecentlyPlayed()
            ]);

            if (player) {
                let playtimeForeverHours: number | null = null;
                let playtimeRecentHours: number | null = null;

                if (player.gameid) {
                    const activeRecentGame = recentGames.find(g => String(g.appid) === String(player.gameid));
                    if (activeRecentGame) {
                        playtimeForeverHours = Number((activeRecentGame.playtime_forever / 60).toFixed(1));
                        playtimeRecentHours = Number((activeRecentGame.playtime_2weeks / 60).toFixed(1));
                    }
                }

                steamData = {
                    personaname: player.personaname,
                    avatar: player.avatarfull,
                    state: player.personastate,
                    game: player.gameextrainfo || null,
                    gameId: player.gameid || null,
                    playtimeForeverHours,
                    playtimeRecentHours
                };
            }
        }

        let spotifyData = null;
        if (spotifyToken) {
            const currentTrack = (await spotifyFetch('me/player/currently-playing', spotifyToken, { cache: 'no-store' })) as SpotifyCurrentlyPlaying | null;
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

        const payload = {
            steam: steamData,
            spotify: spotifyData
        };

        memoryCache = {
            data: payload,
            timestamp: now
        };

        return NextResponse.json(payload, {
            headers: {
                'Cache-Control': 'public, max-age=5, s-maxage=5, stale-while-revalidate=10'
            }
        });

    } catch (error) {
        console.error('Now Playing API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 });
    }
}
