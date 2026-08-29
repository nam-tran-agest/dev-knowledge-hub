"use client";

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
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
        <aside className="w-full lg:w-80 min-w-0 bg-[#0a0e17]/60 backdrop-blur-xl border-b lg:border-r border-white/10 flex flex-col shrink-0">
            {/* Mobile Categories Ribbon */}
            <div className="lg:hidden p-4 border-b border-white/10 bg-[#07090e]/80 w-full min-w-0">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar w-full min-w-0">
                    {categories.map((cat) => {
                        const isActive = cat.id === currentCategoryId;
                        return (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs font-semibold border ${isActive ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'}`}
                            >
                                {cat.icon}
                                <span>{tCategories(cat.id)}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <ScrollArea className="hidden lg:block h-full">
                <div className="p-6 space-y-8">
                    {/* Categories */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">{tSidebar('categories')}</h3>
                        <div className="space-y-1">
                            {categories.map((cat) => {
                                const isActive = cat.id === currentCategoryId;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white font-medium'}`}
                                    >
                                        {cat.icon}
                                        <span className="text-sm">{tCategories(cat.id)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Trending from RSS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> {tSidebar('trending')}
                            </h3>
                        </div>
                        <div className="space-y-5">
                            {trendingItems.slice(0, displayCount).map((news: NewsItem) => (
                                <a key={news.link} href={news.link} target="_blank" rel="noopener noreferrer" className="group block px-2 space-y-1.5">
                                    <div className="flex items-center justify-between gap-4">
                                        <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-cyan-300">{news.categoryId ? tCategories(news.categoryId) : news.category}</Badge>
                                        <TimeDisplay isoDate={news.isoDate} className="text-xs text-slate-400 font-mono" />
                                    </div>
                                    <h4 className="text-sm font-semibold leading-snug text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">{news.title}</h4>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{news.author}</p>
                                </a>
                            ))}
                        </div>
                        {hasMore && (
                            <button
                                onClick={() => setDisplayCount(prev => prev + 5)}
                                className="w-full py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-xs font-semibold transition-all text-slate-300 hover:text-white cursor-pointer"
                            >
                                {tSidebar('viewMoreTrending')}
                            </button>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
