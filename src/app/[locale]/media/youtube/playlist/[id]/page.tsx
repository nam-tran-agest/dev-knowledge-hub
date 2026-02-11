import { YouTubePlaylistContainer } from '@/features/media/components/youtube/youtube-playlist-container';

export default async function PlaylistPage({
    params
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { id } = await params;

    return <YouTubePlaylistContainer playlistId={id} />;
}
