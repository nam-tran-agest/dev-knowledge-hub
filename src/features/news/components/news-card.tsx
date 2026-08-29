import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { NewsItem } from '@/features/news/types';
import { TimeDisplay } from './time-display';
import { useTranslations } from 'next-intl';

export function NewsCard({ item }: { item: NewsItem }) {
    const t = useTranslations('media.news.card');
    const tCategories = useTranslations('media.news.categories');

    return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full group cursor-pointer">
            <Card className="bg-[#070d1e]/50 border-white/10 overflow-hidden hover:border-cyan-500/40 hover:bg-[#0c142c]/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col h-full rounded-3xl backdrop-blur-2xl glare-top">
                <div className="h-52 relative overflow-hidden bg-[#030712]">
                    <Image
                        src={item.image}
                        alt={item.title || "News"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-transparent to-transparent" />
                    <div className="absolute top-3.5 left-3.5 z-10">
                        <Badge className="bg-[#030712]/80 backdrop-blur-md border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold px-3 py-1 shadow-sm">
                            {item.categoryId ? tCategories(item.categoryId) : item.category}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                    <TimeDisplay isoDate={item.isoDate} className="text-xs text-slate-400 font-mono tracking-wider" />
                    <div className="space-y-2 flex-1">
                        <h3 className="text-base font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-normal">{item.excerpt}</p>
                    </div>
                    <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">{item.author}</span>
                        <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:text-cyan-300 transition-all">
                            <span>{t('readMore')}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
