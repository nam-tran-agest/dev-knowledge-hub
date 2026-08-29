"use client";

import { Newspaper, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { NewsCard } from './news-card';
import { NewsItem } from '@/features/news/types';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

const ITEMS_PER_PAGE = 9;

export function NewsGrid({ items }: { items: NewsItem[] }) {
    const t = useTranslations('media.news');
    const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);

    // Reset to page 1 on tab or items change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, items]);

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

    const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));

    const pagedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedItems.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedItems, currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);

        // Smooth scroll to top of news grid
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Calculate visible page numbers for pagination
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    }, [totalPages, currentPage]);

    return (
        <section ref={sectionRef} id="news-grid-section" className="space-y-8 scroll-mt-24">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-4">
                <div className="flex items-center gap-2.5">
                    <Newspaper className="w-5 h-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-mono font-bold uppercase tracking-wider text-white">
                        // {t('latestNews')}
                    </h2>
                    <span className="text-[10px] font-mono text-primary/60 uppercase">
                        [{sortedItems.length} ITEMS]
                    </span>
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

            {/* 3x3 Grid (9 Articles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagedItems.map((item, idx) => (
                    <NewsCard key={item.link || idx} item={item} />
                ))}
            </div>

            {/* Cyberpunk HUD Pagination */}
            {totalPages > 1 && (
                <div className="pt-8 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Telemetry Status */}
                    <div className="text-[11px] font-mono text-primary/70 uppercase tracking-wider">
                        // {t('pagination.page')} <span className="text-white font-bold">{currentPage.toString().padStart(2, '0')}</span> {t('pagination.of')} <span className="text-white font-bold">{totalPages.toString().padStart(2, '0')}</span> [9/PAGE]
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1.5 bg-[#050714]/80 p-1.5 cyber-clip border border-primary/30">
                        {/* First Page */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="First page"
                            className="p-1.5 cyber-clip-button text-primary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>

                        {/* Prev */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-2.5 py-1 cyber-clip-button text-xs font-mono text-primary/70 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">{t('pagination.prev')}</span>
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 px-1">
                            {pageNumbers.map((pageNum, idx) => {
                                if (pageNum === '...') {
                                    return (
                                        <span key={`ellipsis-${idx}`} className="px-2 font-mono text-xs text-primary/40">
                                            ...
                                        </span>
                                    );
                                }

                                const page = pageNum as number;
                                const isActive = page === currentPage;

                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={cn(
                                            "min-w-[32px] h-8 px-2 cyber-clip-button text-xs font-mono font-bold transition-all cursor-pointer",
                                            isActive
                                                ? "bg-primary text-black shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                                                : "text-primary/70 border border-primary/20 hover:border-primary/50 hover:bg-primary/10 hover:text-white"
                                        )}
                                    >
                                        {page.toString().padStart(2, '0')}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-2.5 py-1 cyber-clip-button text-xs font-mono text-primary/70 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                            <span className="hidden xs:inline">{t('pagination.next')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Last Page */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Last page"
                            className="p-1.5 cyber-clip-button text-primary/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
