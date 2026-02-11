import { NewsContainer } from '@/features/news/components/news-container';

export default async function NewsUnifiedPage({
    params
}: {
    params: Promise<{ locale: string; categoryId?: string[] }>;
}) {
    const { locale, categoryId: categoryIdParam } = await params;
    const categoryId = categoryIdParam?.[0] || 'all';

    return <NewsContainer locale={locale} categoryId={categoryId} />;
}
