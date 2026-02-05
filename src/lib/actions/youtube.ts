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

    // Auto-generate title/thumbnail
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    let title = `Video ${videoId}`;
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(oembedUrl);
        if (res.ok) {
            const data = await res.json();
            if (data.title) {
                title = data.title;
            }
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
        // Don't throw for background updates
    }
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const supabase = await createClient();
    try {
        const { error } = await supabase
            .from('youtube_videos')
            .update({
                is_favorite: isFavorite,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Error toggling favorite:', error);
            throw new Error('Failed to toggle favorite');
        }

        revalidatePath('/media/youtube');
    } catch (e) {
        console.error('Error toggling favorite:', e);
        throw new Error('Failed to toggle favorite');
    }
}
