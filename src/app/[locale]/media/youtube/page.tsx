import { PageShell } from '@/components/layout/page-shell';
import { YouTubeContainer } from '@/features/media';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function YouTubePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <PageShell className="bg-transparent">
            <YouTubeContainer locale={locale} />
        </PageShell>
    );
}
