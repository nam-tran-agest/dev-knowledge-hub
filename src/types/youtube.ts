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
