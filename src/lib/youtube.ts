export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
}

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function getVideos(query: string = 'web development trends 2024', maxResults: number = 12): Promise<YouTubeVideo[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.error('YOUTUBE_API_KEY is not set');
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${apiKey}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            console.error('Failed to fetch from YouTube API', await response.text());
            return [];
        }

        const data = await response.json();

        if (!data.items) return [];

        return data.items.map((item: { id: { videoId: string }, snippet: any }) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}
