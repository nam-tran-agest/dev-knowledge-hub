import { getTranslations } from 'next-intl/server';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notFound } from 'next/navigation';
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Modular Components
import { NewsSidebar } from '@/components/news/news-sidebar';
import { FeaturedArticle } from '@/components/news/featured-article';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsItem } from '@/types/news';

import { getNews } from '@/lib/news';
import { CATEGORIES } from '@/config/news-feeds';

export default async function NewsUnifiedPage({
    params
}: {
    params: Promise<{ locale: string; categoryId?: string[] }>;
}) {
    const { locale, categoryId: categoryIdParam } = await params;
    const categoryId = categoryIdParam?.[0] || 'all';

    // Validate category if it's not 'all'
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'media.news' });
    const tCategories = await getTranslations({ locale, namespace: 'media.news.categories' });

    // Fetch news based on category
    const newsItems = await getNews(categoryId === 'all' ? undefined : categoryId);

    if (newsItems.length === 0 && categoryId === 'all') {
        return (
            <div className="min-h-screen pt-32 bg-[#0a0a0c] text-center">
                <h2 className="text-2xl font-bold">{t('noNews')}</h2>
                <p className="text-slate-500 mt-2">{t('tryAgain')}</p>
            </div>
        );
    }

    // Diverse Selection for Featured Carousel (only for 'all' or if many items)
    let featuredItems: NewsItem[] = [];
    if (categoryId === 'all') {
        const seenSources = new Set<string>();
        for (const item of newsItems) {
            if (!seenSources.has(item.author) && featuredItems.length < 5) {
                featuredItems.push(item);
                seenSources.add(item.author);
            }
        }
        if (featuredItems.length < 5) {
            for (const item of newsItems) {
                if (!featuredItems.find(fi => fi.link === item.link) && featuredItems.length < 5) {
                    featuredItems.push(item);
                }
            }
        }
    } else {
        featuredItems = newsItems.slice(0, 5);
    }

    const featuredLinks = new Set(featuredItems.map(i => i.link));
    const remainingItems = newsItems.filter(i => !featuredLinks.has(i.link));

    // Trending items (always from 'all' for sidebar if we want global trending)
    // Or just slice from the current list for simplicity if on category page
    const trendingItems = (categoryId === 'all' ? remainingItems : await getNews()).slice(0, 10);
    const feedItems = remainingItems.slice(categoryId === 'all' ? 10 : 0, 30);

    // Map icons from strings to components for the sidebar
    const CATEGORIES_WITH_ICONS = CATEGORIES.map(cat => {
        const IconComponent = (LucideIcons as any)[cat.icon as string] || LucideIcons.Globe;
        return {
            ...cat,
            icon: React.createElement(IconComponent, { className: "w-4 h-4" })
        };
    });

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200">
            <div className="flex flex-col lg:flex-row overflow-hidden">
                <NewsSidebar categories={CATEGORIES_WITH_ICONS} trendingItems={trendingItems} />

                <main className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    <ScrollArea className="flex-1">
                        <div className="px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            {/* Category Header */}
                            {categoryId !== 'all' && (
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                        {tCategories(categoryId)}
                                    </h1>
                                    <p className="text-slate-500">
                                        {t('categoryDescription', { category: tCategories(categoryId) })}
                                    </p>
                                </div>
                            )}

                            {featuredItems.length > 0 && (
                                <FeaturedArticle items={featuredItems} />
                            )}

                            <NewsGrid items={feedItems} />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
