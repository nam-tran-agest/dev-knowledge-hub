import { NextResponse } from 'next/server';
import { matchGameToPlaylist } from '@/features/media/services/game-mood';
import { getUserSteamId, getSteamPlayerSummary } from '@/features/media/lib/steam-client';
import { getSpotifyAuthToken } from '@/features/media/services/spotify';
import { playSpotifyContext } from '@/features/media/services/spotify-api';

export async function POST(request: Request) {
    try {
        // 1. Xác thực Steam và lấy Game đang chơi
        const steamId = await getUserSteamId();
        if (!steamId) {
            return NextResponse.json({ error: 'STEAM_NOT_CONNECTED' }, { status: 400 });
        }

        const player = await getSteamPlayerSummary();
        if (!player) {
            return NextResponse.json({ error: 'STEAM_PROFILE_UNAVAILABLE' }, { status: 400 });
        }

        const gameId = player.gameid;
        const gameName = player.gameextrainfo;

        if (!gameId) {
            return NextResponse.json({ message: 'NOT_PLAYING_GAME', status: 'idle' });
        }

        // 2. Chạy qua Game-Mood Scoring Logic
        const { playlistUri, matchedTags } = await matchGameToPlaylist(gameId);

        // 3. Đẩy lệnh sang Spotify
        const spotifyToken = await getSpotifyAuthToken();
        if (!spotifyToken) {
            return NextResponse.json({ 
                error: 'SPOTIFY_NOT_CONNECTED',
                gameName,
                matchedTags,
                playlistUri 
            }, { status: 400 });
        }

        // Kiểm tra request body xem client có bắt buộc đổi nhạc không
        const body = await request.json().catch(() => ({}));
        const forcePlay = body.forcePlay === true;

        if (forcePlay) {
            const playResult = await playSpotifyContext(spotifyToken, playlistUri);
            if (playResult.error === 'NO_ACTIVE_DEVICE') {
                return NextResponse.json({
                    error: 'NO_ACTIVE_DEVICE',
                    gameName,
                    matchedTags,
                    playlistUri
                });
            }
        }

        return NextResponse.json({
            status: 'synced',
            gameName,
            gameId,
            playlistUri,
            matchedTags
        });

    } catch (error: unknown) {
        console.error('Lỗi Sync Game Mood:', error);
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}
