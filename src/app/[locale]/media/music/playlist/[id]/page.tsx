import { SpotifyPlaylistContainer } from '@/features/media';

interface SpotifyPlaylistPageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default async function SpotifyPlaylistPage({ params }: SpotifyPlaylistPageProps) {
    const { locale, id } = await params;

    return <SpotifyPlaylistContainer locale={locale} playlistId={id} />;
}
