"use client";

import { Newspaper } from 'lucide-react';
import { NewsCard } from './news-card';
import { NewsItem } from '@/types/news';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

export function NewsGrid({ items }: { items: NewsItem[] }) {
    const t = useTranslations('media.news');
    const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');

    const sortedItems = useMemo(() => {
        if (activeTab === 'recent') {
            return items; // Already sorted by date
        }
        // Popular: Engagement score based on content density
        return [...items].sort((a, b) => {
            const scoreA = (a.title.length * 1.5) + (a.excerpt?.length || 0);
            const scoreB = (b.title.length * 1.5) + (b.excerpt?.length || 0);
            return scoreB - scoreA;
        });
    }, [items, activeTab]);

    return (
        <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <Newspaper className="w-6 h-6 text-emerald-400" /> {t('latestNews')}
                </h2>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 w-fit">
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                            activeTab === 'recent'
                                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                    >
                        {t('recent')}
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={cn(
                            "px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300",
                            activeTab === 'popular'
                                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                    >
                        {t('popular')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedItems.map((item, idx) => (
                    <NewsCard key={item.link || idx} item={item} />
                ))}
            </div>
        </section>
    );
}
