"use client";

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Terminal } from 'lucide-react';
import { NewsItem, NewsCategory } from '@/features/news/types';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { TimeDisplay } from './time-display';

interface NewsSidebarProps {
    categories: NewsCategory[];
    trendingItems: NewsItem[];
}

export function NewsSidebar({ categories, trendingItems }: NewsSidebarProps) {
    const tCategories = useTranslations('media.news.categories');
    const tSidebar = useTranslations('media.news.sidebar');
    const params = useParams();
    const currentCategoryId = params.categoryId as string || 'all';
    const [displayCount, setDisplayCount] = useState(5);

    const hasMore = displayCount < trendingItems.length;

    return (
        <aside className="w-full lg:w-80 min-w-0 bg-[#04060f]/90 backdrop-blur-2xl border-b lg:border-r border-primary/25 flex flex-col shrink-0 relative">
            {/* Mobile Categories Ribbon */}
            <div className="lg:hidden p-3 border-b border-primary/20 bg-card/60 w-full min-w-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar w-full min-w-0">
                    {categories.map((cat) => {
                        const isActive = cat.id === currentCategoryId;
                        return (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                className={`flex items-center gap-1.5 px-3 py-1.5 cyber-clip-button whitespace-nowrap transition-all text-xs font-mono uppercase tracking-wider border ${
                                    isActive
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold'
                                        : 'text-primary/60 border-primary/20 hover:bg-primary/10 hover:text-white'
                                }`}
                            >
                                {cat.icon}
                                <span>{tCategories(cat.id)}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <ScrollArea className="hidden lg:block h-full custom-scrollbar">
                <div className="p-5 space-y-6">
                    {/* Categories */}
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 px-2">
                            <Terminal className="w-3.5 h-3.5 text-primary" />
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">// {tSidebar('categories')}</h3>
                        </div>
                        <div className="space-y-1">
                            {categories.map((cat) => {
                                const isActive = cat.id === currentCategoryId;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                        className={`flex items-center gap-2.5 px-3 py-2 cyber-clip-button cursor-pointer transition-all border ${
                                            isActive
                                                ? 'bg-primary/20 border-primary/60 text-primary font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                                : 'text-primary/70 border-transparent hover:border-primary/30 hover:bg-primary/5 hover:text-white'
                                        }`}
                                    >
                                        {cat.icon}
                                        <span className="text-xs font-mono uppercase tracking-wider">{tCategories(cat.id)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <Separator className="bg-primary/20" />

                    {/* Trending from RSS */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-primary" /> // {tSidebar('trending')}
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {trendingItems.slice(0, displayCount).map((news: NewsItem) => (
                                <a
                                    key={news.link}
                                    href={news.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-3 cyber-clip bg-card/40 border border-primary/20 hover:border-primary/60 hover:bg-primary/5 space-y-1.5 transition-all"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge variant="outline" className="text-[9px] bg-primary/10 border-primary/30 text-primary">
                                            {news.categoryId ? tCategories(news.categoryId) : news.category}
                                        </Badge>
                                        <TimeDisplay isoDate={news.isoDate} className="text-[10px] text-primary/50 font-mono" />
                                    </div>
                                    <h4 className="text-xs font-mono font-bold leading-snug text-slate-200 group-hover:text-primary transition-colors line-clamp-2 uppercase">
                                        {news.title}
                                    </h4>
                                    <p className="text-[9px] text-primary/60 uppercase tracking-widest font-mono">// {news.author}</p>
                                </a>
                            ))}
                        </div>
                        {hasMore && (
                            <button
                                onClick={() => setDisplayCount(prev => prev + 5)}
                                className="w-full py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 cyber-clip-button text-xs font-mono font-bold uppercase tracking-wider transition-all text-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
                            >
                                [ {tSidebar('viewMoreTrending')} ]
                            </button>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
