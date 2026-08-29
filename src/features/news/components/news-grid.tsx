"use client";

import { Newspaper } from 'lucide-react';
import { NewsCard } from './news-card';
import { NewsItem } from '@/features/news/types';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

export function NewsGrid({ items }: { items: NewsItem[] }) {
    const t = useTranslations('media.news');
    const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');

    const sortedItems = useMemo(() => {
        if (activeTab === 'recent') {
            return items;
        }
        return [...items].sort((a, b) => {
            const scoreA = (a.title.length * 1.5) + (a.excerpt?.length || 0);
            const scoreB = (b.title.length * 1.5) + (b.excerpt?.length || 0);
            return scoreB - scoreA;
        });
    }, [items, activeTab]);

    return (
        <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-4">
                <div className="flex items-center gap-2.5">
                    <Newspaper className="w-5 h-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-mono font-bold uppercase tracking-wider text-white">
                        // {t('latestNews')}
                    </h2>
                </div>
                <div className="flex items-center gap-1.5 bg-[#050714] p-1 cyber-clip-button border border-primary/30 w-fit">
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={cn(
                            "px-4 py-1.5 cyber-clip-button text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer",
                            activeTab === 'recent'
                                ? "bg-primary text-black shadow-[0_0_10px_var(--color-primary)]"
                                : "text-primary/60 hover:text-white"
                        )}
                    >
                        [ 01-{t('recent')} ]
                    </button>
                    <button
                        onClick={() => setActiveTab('popular')}
                        className={cn(
                            "px-4 py-1.5 cyber-clip-button text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer",
                            activeTab === 'popular'
                                ? "bg-primary text-black shadow-[0_0_10px_var(--color-primary)]"
                                : "text-primary/60 hover:text-white"
                        )}
                    >
                        [ 02-{t('popular')} ]
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItems.map((item, idx) => (
                    <NewsCard key={item.link || idx} item={item} />
                ))}
            </div>
        </section>
    );
}
