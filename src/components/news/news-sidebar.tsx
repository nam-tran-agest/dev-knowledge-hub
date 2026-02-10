"use client";

import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { NewsItem, NewsCategory } from '@/types/news';
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
        <aside className="w-full lg:w-80 min-w-0 bg-[#111114] border-b lg:border-r border-white/5 flex flex-col shrink-0">
            {/* Mobile Categories Ribbon */}
            <div className="lg:hidden p-4 border-b border-white/5 bg-[#0a0a0c] w-full min-w-0">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar w-full min-w-0">
                    {categories.map((cat) => {
                        const isActive = cat.id === currentCategoryId;
                        return (
                            <Link
                                key={cat.id}
                                href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${isActive ? 'bg-emerald-500 border-emerald-500 text-white' : 'text-slate-400 border-white/10 hover:bg-white/5 hover:text-slate-200'}`}
                            >
                                {cat.icon}
                                <span className="text-xs font-bold">{tCategories(cat.id)}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <ScrollArea className="hidden lg:block h-full">
                <div className="p-6 space-y-10">
                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">{tSidebar('categories')}</h3>
                        <div className="space-y-1">
                            {categories.map((cat) => {
                                const isActive = cat.id === currentCategoryId;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={cat.id === 'all' ? '/media/news' : `/media/news/${cat.id}`}
                                        className={`flex items-center gap-4 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
                                    >
                                        {cat.icon}
                                        <span className="text-sm font-bold">{tCategories(cat.id)}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* Trending from RSS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3" /> {tSidebar('trending')}
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {trendingItems.slice(0, displayCount).map((news: NewsItem) => (
                                <a key={news.link} href={news.link} target="_blank" rel="noopener noreferrer" className="group block px-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <Badge variant="outline" className="text-[9px] h-4 bg-white/5 border-none text-slate-400">{news.categoryId ? tCategories(news.categoryId) : news.category}</Badge>
                                        <TimeDisplay isoDate={news.isoDate} className="text-[10px] text-slate-500 font-bold" />
                                    </div>
                                    <h4 className="text-sm font-bold mt-2 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">{news.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{news.author}</p>
                                </a>
                            ))}
                        </div>
                        {hasMore && (
                            <button
                                onClick={() => setDisplayCount(prev => prev + 5)}
                                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors text-slate-400 cursor-pointer"
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
