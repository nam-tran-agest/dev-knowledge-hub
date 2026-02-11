'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getSpotifyTokens, refreshSpotifyToken, spotifyFetch } from './spotify-api';

export async function getSpotifyAuthToken() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: credentials, error } = await supabase
        .from('spotify_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error || !credentials) return null;

    // Check if token is expired (with 1 min buffer)
    if (new Date(credentials.expires_at).getTime() < Date.now() + 60000) {
        try {
            const tokens = await refreshSpotifyToken(credentials.refresh_token);
            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

            const { error: updateError } = await supabase
                .from('spotify_credentials')
                .update({
                    access_token: tokens.access_token,
                    expires_at: expiresAt
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;
            return tokens.access_token;
        } catch (e) {
            console.error('Error refreshing Spotify token:', e);
            return null;
        }
    }

    return credentials.access_token;
}

export async function saveSpotifyTokens(code: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const tokens = await getSpotifyTokens(code);
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    const { error } = await supabase
        .from('spotify_credentials')
        .upsert({
            user_id: user.id,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at: expiresAt
        });

    if (error) {
        console.error('Error saving Spotify tokens:', error);
        throw new Error('Failed to save Spotify connection');
    }

    revalidatePath('/media/music');
}

export async function disconnectSpotify() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
        .from('spotify_credentials')
        .delete()
        .eq('user_id', user.id);

    revalidatePath('/media/music');
}

export async function getTopTracks(limit = 10) {
    const token = await getSpotifyAuthToken();
    if (!token) return [];

    const data = await spotifyFetch(`me/top/tracks?limit=${limit}&time_range=short_term`, token);
    return data?.items || [];
}

export async function getTopArtists(limit = 10) {
    const token = await getSpotifyAuthToken();
    if (!token) return [];

    const data = await spotifyFetch(`me/top/artists?limit=${limit}&time_range=short_term`, token);
    return data?.items || [];
}

export async function getUserPlaylists(limit = 10) {
    const token = await getSpotifyAuthToken();
    if (!token) return [];

    const data = await spotifyFetch(`me/playlists?limit=${limit}`, token);
    return data?.items || [];
}

export async function getPlaylist(id: string) {
    const token = await getSpotifyAuthToken();
    if (!token) return null;

    return await spotifyFetch(`playlists/${id}`, token);
}

export async function getPlaylistTracks(id: string, limit = 50) {
    const token = await getSpotifyAuthToken();
    if (!token) return [];

    const data = await spotifyFetch(`playlists/${id}/tracks?limit=${limit}`, token);
    return data?.items || [];
}
