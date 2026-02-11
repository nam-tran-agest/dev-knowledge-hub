export interface SavedVideo {
    id: string;
    url: string;
    title: string | null;
    thumbnail_url: string | null;
    saved_time: number;
    is_favorite: boolean;
    updated_at: string;
    created_at: string;
}

export interface SavedPlaylist {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    is_favorite: boolean;
    user_id?: string;
    video_count?: number; // Optional virtual field
    video_thumbnails?: string[]; // To store thumbnails of videos in playlist
}

export interface PlaylistItem {
    id: string;
    created_at: string;
    playlist_id: string;
    video_id: string;
    position: number;
}
