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

    // Parallelize translation and news fetching
    const [t, tCategories, newsItems] = await Promise.all([
        getTranslations({ locale, namespace: 'media.news' }),
        getTranslations({ locale, namespace: 'media.news.categories' }),
        getNews(categoryId === 'all' ? undefined : categoryId)
    ]);

    if (newsItems.length === 0 && categoryId === 'all') {
        return (
            <div className="min-h-screen pt-32 bg-[#0a0a0c] text-center">
                <h2 className="text-2xl font-bold">{t('noNews')}</h2>
                <p className="text-slate-500 mt-2">{t('tryAgain')}</p>
            </div>
        );
    }

    // Diverse Selection for Featured Carousel
    const featuredItems: NewsItem[] = [];
    if (categoryId === 'all') {
        const seenSources = new Set<string>();
        // First pass: unique sources
        for (const item of newsItems) {
            if (!seenSources.has(item.author) && featuredItems.length < 5) {
                featuredItems.push(item);
                seenSources.add(item.author);
            }
        }
        // Second pass: fill remaining
        if (featuredItems.length < 5) {
            for (const item of newsItems) {
                if (featuredItems.length >= 5) break;
                if (!featuredItems.some(fi => fi.link === item.link)) {
                    featuredItems.push(item);
                }
            }
        }
    } else {
        featuredItems.push(...newsItems.slice(0, 5));
    }

    const featuredLinks = new Set(featuredItems.map(i => i.link));
    const remainingItems = newsItems.filter(i => !featuredLinks.has(i.link));

    // Trending items: 
    // If we're on 'all', take from remaining. 
    // If on category, we might want global trending, but to save an API call, we can just use category items for now 
    // or fetch global once in a separate block if really needed. 
    // For now, let's optimize to use current items unless on category where we might want 'real' global trending.
    let trendingItems: NewsItem[] = [];
    if (categoryId === 'all') {
        trendingItems = remainingItems.slice(0, 10);
    } else {
        // Only fetch global trending if we're in a specific category to keep sidebar relevant
        trendingItems = (await getNews()).slice(0, 10);
    }

    const feedItems = categoryId === 'all' ? remainingItems.slice(10, 40) : remainingItems.slice(0, 30);

    // Map icons from strings to components for the sidebar
    const CATEGORIES_WITH_ICONS = CATEGORIES.map(cat => {
        const IconComponent = (LucideIcons as any)[cat.icon as string] || LucideIcons.Globe;
        return {
            ...cat,
            icon: React.createElement(IconComponent, { className: "w-4 h-4" })
        };
    });

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200 overflow-x-hidden">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden">
                <NewsSidebar categories={CATEGORIES_WITH_ICONS} trendingItems={trendingItems} />

                <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="px-4 md:px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            {/* Category Header */}
                            {categoryId !== 'all' && (
                                <div className="space-y-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                        {tCategories(categoryId)}
                                    </h1>
                                    <p className="text-sm md:text-base text-slate-500">
                                        {t('categoryDescription', { category: tCategories(categoryId) })}
                                    </p>
                                </div>
                            )}

                            {featuredItems.length > 0 && (
                                <FeaturedArticle items={featuredItems} />
                            )}

                            <NewsGrid items={feedItems} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
