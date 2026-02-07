import { getTranslations } from 'next-intl/server';
import { Globe, Cpu, Gamepad, Zap, Tv, Languages, HeartPulse, Briefcase, Trophy, GraduationCap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XMLParser } from 'fast-xml-parser';

// Modular Components
import { NewsSidebar } from '@/components/news/news-sidebar';
import { NewsHeaderControls } from '@/components/news/news-header-controls';
import { FeaturedArticle } from '@/components/news/featured-article';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsItem } from '@/components/news/types';

import { getNews, CATEGORIES } from '@/lib/news';

// Add icons to CATEGORIES for the UI
const CATEGORIES_WITH_ICONS = CATEGORIES.map(cat => {
    switch (cat.id) {
        case 'all': return { ...cat, icon: <Globe className="w-4 h-4" /> };
        case 'tech-science': return { ...cat, icon: <Cpu className="w-4 h-4" /> };
        case 'gaming': return { ...cat, icon: <Gamepad className="w-4 h-4" /> };
        case 'entertainment': return { ...cat, icon: <Tv className="w-4 h-4" /> };
        case 'ai-future': return { ...cat, icon: <Zap className="w-4 h-4" /> };
        case 'world': return { ...cat, icon: <Languages className="w-4 h-4" /> };
        case 'health': return { ...cat, icon: <HeartPulse className="w-4 h-4" /> };
        case 'business': return { ...cat, icon: <Briefcase className="w-4 h-4" /> };
        case 'sports': return { ...cat, icon: <Trophy className="w-4 h-4" /> };
        case 'education': return { ...cat, icon: <GraduationCap className="w-4 h-4" /> };
        default: return { ...cat, icon: <Globe className="w-4 h-4" /> };
    }
});

export default async function NewsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.news' });
    const newsItems = await getNews();

    if (newsItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 bg-[#0a0a0c] text-center">
                <h2 className="text-2xl font-bold">Không có tin tức nào để hiển thị.</h2>
                <p className="text-slate-500 mt-2">Vui lòng thử lại sau.</p>
            </div>
        );
    }

    // Diverse Selection for Featured Carousel
    const featuredItems: NewsItem[] = [];
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

    const featuredLinks = new Set(featuredItems.map(i => i.link));
    const remainingItems = newsItems.filter(i => !featuredLinks.has(i.link));

    const trendingItems = remainingItems.slice(0, 10);
    const feedItems = remainingItems.slice(10, 25);

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200">
            <div className="flex flex-col lg:flex-row overflow-hidden">
                <NewsSidebar categories={CATEGORIES_WITH_ICONS} trendingItems={trendingItems} />

                <main className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    {/* <NewsHeaderControls /> */}

                    <ScrollArea className="flex-1">
                        <div className="px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            <FeaturedArticle items={featuredItems} />
                            <NewsGrid items={feedItems} />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
