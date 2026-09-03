import { NewsContainer } from '@/features/news';
import { CATEGORIES } from '@/features/news/constants/feeds';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 600; // 10-minute Edge ISR caching

export function generateStaticParams() {
    const paths: { locale: string; categoryId?: string[] }[] = [];

    routing.locales.forEach((locale) => {
        // Base /media/news (all)
        paths.push({ locale, categoryId: undefined });
        // Specific categories
        CATEGORIES.forEach((category) => {
            if (category.id !== 'all') {
                paths.push({ locale, categoryId: [category.id] });
            }
        });
    });

    return paths;
}

export default async function NewsUnifiedPage({
    params
}: {
    params: Promise<{ locale: string; categoryId?: string[] }>;
}) {
    const { locale, categoryId: categoryIdParam } = await params;
    setRequestLocale(locale);
    const categoryId = categoryIdParam?.[0] || 'all';

    return <NewsContainer locale={locale} categoryId={categoryId} />;
}
