import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SteamContainer } from '@/features/media/components/gaming/steam-container';
import { PageShell } from '@/components/layout/page-shell';
import { routing } from '@/i18n/routing';

interface GamingPageProps {
    params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: GamingPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.gaming' });

    return {
        title: `${t('title')} | Dev Knowledge Hub`,
        description: t('description'),
    };
}

export default async function GamingPage({ params }: GamingPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <PageShell variant="landing">
            <SteamContainer />
        </PageShell>
    );
}
