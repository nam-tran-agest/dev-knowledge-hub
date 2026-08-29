/**
 * YouTube Utility Functions
 * Centralized helpers for parsing YouTube IDs, formatting playback time, and embed URLs.
 */

/**
 * Extracts a clean 11-character YouTube video ID from various URL formats or direct IDs.
 */
export function extractCleanVideoId(urlOrId: string): string {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    if (match && match[1]) {
        return match[1];
    }
    const fallback = clean.match(/[\w-]{11}/);
    return fallback ? fallback[0] : clean;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS format.
 */
export function formatVideoTime(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Generates the high-resolution thumbnail URL for a given video ID.
 */
export function getYoutubeThumbnail(videoId: string): string {
    const cleanId = extractCleanVideoId(videoId);
    if (!cleanId) return '';
    return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
}

/**
 * Generates a privacy-enhanced YouTube embed URL.
 */
export function getYoutubeEmbedUrl(videoId: string, startTime: number = 0): string {
    const cleanId = extractCleanVideoId(videoId);
    if (!cleanId) return '';
    return `https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1&enablejsapi=1&start=${Math.floor(startTime)}&rel=0&modestbranding=1`;
}
