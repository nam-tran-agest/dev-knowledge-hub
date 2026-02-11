import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import {
    Globe, Zap, Languages, Trophy, Cpu, Gamepad,
    HeartPulse, Tv, Briefcase, GraduationCap,
    type LucideIcon
} from 'lucide-react';

// Modular Components
import { NewsSidebar } from '@/features/news/components/news-sidebar';
import { FeaturedArticle } from '@/features/news/components/featured-article';
import { NewsGrid } from '@/features/news/components/news-grid';
import { NewsItem } from '@/features/news/types';
import { PageShell } from '@/components/layout/page-shell';

import { getNews } from '@/features/news/services/news';
import { CATEGORIES } from '@/features/news/constants/feeds';

/** Explicit map of category icon names to components — avoids bundling all 1500 lucide icons */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
    Globe, Zap, Languages, Trophy, Cpu, Gamepad,
    HeartPulse, Tv, Briefcase, GraduationCap,
};

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
            <PageShell variant="landing" className="bg-[#0a0a0c] text-center pt-32">
                <h2 className="text-2xl font-bold">{t('noNews')}</h2>
                <p className="text-slate-500 mt-2">{t('tryAgain')}</p>
            </PageShell>
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
        const IconComponent = CATEGORY_ICON_MAP[cat.icon as string] || Globe;
        return {
            ...cat,
            icon: React.createElement(IconComponent, { className: "w-4 h-4" })
        };
    });

    return (
        <PageShell variant="landing" className="bg-[#0a0a0c] text-slate-200 overflow-x-hidden">
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
        </PageShell>
    );
}
