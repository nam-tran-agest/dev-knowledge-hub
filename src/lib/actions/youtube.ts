'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to extract Video ID
function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export async function getVideos() {
    const supabase = await createClient();

    // Use RPC for smart history (10 active days)
    const { data, error } = await supabase.rpc('get_videos_paginated_by_days', {
        days_limit: 10,
        days_offset: 0
    });

    if (error) {
        console.error('Error fetching videos (RPC):', error);
        // Fallback: use created_at in case updated_at/RPC are missing
        const { data: fallbackData, error: fallbackError } = await supabase
            .from('youtube_videos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (fallbackError) {
            console.error('Fallback fetch error:', fallbackError);
            return [];
        }
        return fallbackData || [];
    }

    return data;
}

export async function addVideo(formData: FormData) {
    const url = formData.get('url') as string;
    if (!url) return;

    const videoId = getYouTubeId(url);
    if (!videoId) {
        throw new Error('Invalid YouTube URL');
    }

    const supabase = await createClient();
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    let title = `Video ${videoId}`;
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
            const data = await res.json();
            if (data.title) title = data.title;
        }
    } catch (e) {
        console.error('Error fetching oembed:', e);
    }

    const { error } = await supabase
        .from('youtube_videos')
        .insert({
            url,
            title,
            thumbnail_url: thumbnailUrl,
            saved_time: 0
        });

    if (error) {
        console.error('Error adding video:', error);
        throw new Error('Failed to add video');
    }

    revalidatePath('/media/youtube');
}

export async function deleteVideo(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting video:', error);
        throw new Error('Failed to delete video');
    }

    revalidatePath('/media/youtube');
}

export async function updateVideoProgress(id: string, time: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_videos')
        .update({
            saved_time: time,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating progress:', error);
    }
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_videos')
        .update({
            is_favorite: isFavorite,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) throw new Error('Failed to toggle favorite');
    revalidatePath('/media/youtube');
}

// --- Playlist Actions ---

export async function getPlaylists() {
    const supabase = await createClient();

    // Fetch playlists along with their video count
    const { data, error } = await supabase
        .from('youtube_playlists')
        .select(`
            *,
            video_count:youtube_playlist_items(count)
        `)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }

    // Transform count object to number
    return (data || []).map(p => ({
        ...p,
        video_count: p.video_count?.[0]?.count || 0
    }));
}

export async function createPlaylist(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title) throw new Error('Title is required');

    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_playlists')
        .insert({
            title,
            description
        });

    if (error) {
        console.error('Error creating playlist:', error);
        throw new Error('Failed to create playlist');
    }

    revalidatePath('/media/youtube');
}

export async function deletePlaylist(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_playlists')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting playlist:', error);
        throw new Error('Failed to delete playlist');
    }

    revalidatePath('/media/youtube');
}

export async function addVideoToPlaylist(videoId: string, playlistId: string) {
    const supabase = await createClient();

    // Check if thumbnail needs updating for playlist
    const { data: video } = await supabase
        .from('youtube_videos')
        .select('thumbnail_url')
        .eq('id', videoId)
        .single();

    const { error } = await supabase
        .from('youtube_playlist_items')
        .insert({
            video_id: videoId,
            playlist_id: playlistId
        });

    if (error) {
        if (error.code === '23505') return; // Already exists
        console.error('Error adding video to playlist:', error);
        throw new Error('Failed to add video to playlist');
    }

    // Update playlist thumbnail if it's the first video
    if (video?.thumbnail_url) {
        await supabase
            .from('youtube_playlists')
            .update({
                thumbnail_url: video.thumbnail_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', playlistId)
            .is('thumbnail_url', null);
    }

    revalidatePath('/media/youtube');
}

export async function removeVideoFromPlaylist(videoId: string, playlistId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_playlist_items')
        .delete()
        .eq('video_id', videoId)
        .eq('playlist_id', playlistId);

    if (error) {
        console.error('Error removing video from playlist:', error);
        throw new Error('Failed to remove video from playlist');
    }

    revalidatePath('/media/youtube');
}

export async function getPlaylistVideos(playlistId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('youtube_playlist_items')
        .select(`
            video_id,
            youtube_videos (*)
        `)
        .eq('playlist_id', playlistId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching playlist videos:', error);
        return [];
    }

    return (data || []).map(item => item.youtube_videos);
}

export async function togglePlaylistFavorite(id: string, isFavorite: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('youtube_playlists')
        .update({
            is_favorite: isFavorite,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) throw new Error('Failed to toggle playlist favorite');
    revalidatePath('/media/youtube');
}
