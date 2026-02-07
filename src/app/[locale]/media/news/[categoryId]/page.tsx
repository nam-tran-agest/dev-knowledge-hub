import { getTranslations } from 'next-intl/server';
import { Globe, Cpu, Gamepad, Zap, Tv, Languages, HeartPulse, Briefcase, Trophy, GraduationCap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNews, CATEGORIES } from '@/lib/news';

// Modular Components
import { NewsSidebar } from '@/components/news/news-sidebar';
import { NewsHeaderControls } from '@/components/news/news-header-controls';
import { FeaturedArticle } from '@/components/news/featured-article';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsItem } from '@/components/news/types';
import { notFound } from 'next/navigation';

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

export default async function CategoryPage({
    params
}: {
    params: Promise<{ locale: string; categoryId: string }>;
}) {
    const { locale, categoryId } = await params;

    // Validate category
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category || categoryId === 'all') {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'media.news' });
    const allNews = await getNews();

    // In a real RSS scenario, we might have different URLs per category.
    // For now, we simulate filtering if the category is not 'all'.
    // Since we only have 5 general RSS feeds, we show a subset or filter by title/content keywords
    // to make it look realistic.

    const filteredNews = allNews.filter(item => {
        const content = (item.title + ' ' + item.excerpt).toLowerCase();
        if (categoryId === 'tech-science') return content.includes('công nghệ') || content.includes('khoa học') || content.includes('tech') || content.includes('science');
        if (categoryId === 'gaming') return content.includes('game') || content.includes('trò chơi');
        if (categoryId === 'ai-future') return content.includes('ai') || content.includes('trí tuệ nhân tạo') || content.includes('tương lai');
        // Fallback: just show some items for other categories to demonstrate the page works
        return true;
    });

    if (filteredNews.length === 0 && allNews.length > 0) {
        // Just as fallback so the page isn't empty during demo
        filteredNews.push(...allNews.slice(0, 10));
    }

    const featuredItems = filteredNews.slice(0, 5);
    const trendingItems = allNews.slice(0, 10); // trending can stay global
    const feedItems = filteredNews.slice(5, 25);

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200">
            <div className="flex flex-col lg:flex-row overflow-hidden">
                <NewsSidebar categories={CATEGORIES_WITH_ICONS} trendingItems={trendingItems} />

                <main className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    <NewsHeaderControls />

                    <ScrollArea className="flex-1">
                        <div className="px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                    {category.name}
                                </h1>
                                <p className="text-slate-500">
                                    Displaying latest news for {category.name}
                                </p>
                            </div>

                            {featuredItems.length > 0 ? (
                                <FeaturedArticle items={featuredItems} />
                            ) : null}

                            <NewsGrid items={feedItems} />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
