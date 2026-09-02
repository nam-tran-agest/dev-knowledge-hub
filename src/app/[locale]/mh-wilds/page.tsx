import { MHWildsContainer } from '@/features/mh-wilds';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const revalidate = 86400;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function MHWildsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <MHWildsContainer />;
}
