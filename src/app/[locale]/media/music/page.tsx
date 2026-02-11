


import { MusicContainer } from '@/features/media/components/music/music-container';

interface MusicPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string }>;
}

export default async function MusicPage({ searchParams }: MusicPageProps) {
    const { category = 'top-tracks' } = await searchParams;

    return <MusicContainer category={category} />;
}
