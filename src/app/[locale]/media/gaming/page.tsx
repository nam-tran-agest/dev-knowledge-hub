import { getTranslations } from 'next-intl/server';
import { SteamContainer } from '@/features/media/components/gaming/steam-container';
import { PageShell } from '@/components/layout/page-shell';

interface GamingPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GamingPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.gaming' });

    return {
        title: `${t('title')} | Dev Knowledge Hub`,
        description: t('description'),
    };
}

export default async function GamingPage() {
    return (
        <PageShell variant="landing">
            <SteamContainer />
        </PageShell>
    );
}
