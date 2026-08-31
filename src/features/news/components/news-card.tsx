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
            <Card className="bg-card/70 border-primary/25 overflow-hidden hover:border-primary hover:bg-card hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-300 flex flex-col h-full cyber-clip backdrop-blur-2xl">
                <div className="h-48 relative overflow-hidden bg-surface">
                    <Image
                        src={item.image}
                        alt={item.title || "News"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                        unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 z-10">
                        <Badge className="bg-background/80 backdrop-blur-md border-primary/40 text-primary text-[10px] font-mono font-bold px-2.5 py-0.5 shadow-sm">
                            {item.categoryId ? tCategories(item.categoryId) : item.category}
                        </Badge>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-primary/30 text-[8px] uppercase tracking-widest text-primary/80 font-mono cyber-clip-tag">
                        // DISPATCH
                    </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-1 space-y-3">
                    <TimeDisplay isoDate={item.isoDate} className="text-[10px] text-primary/50 font-mono tracking-wider" />
                    <div className="space-y-1.5 flex-1">
                        <h3 className="text-sm font-mono font-bold leading-snug text-white group-hover:text-primary transition-colors line-clamp-2 uppercase">
                            {item.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-300 line-clamp-2 leading-relaxed">
                            {item.excerpt}
                        </p>
                    </div>
                    <div className="pt-3 border-t border-primary/20 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">// {item.author}</span>
                        <div className="px-2.5 py-1 bg-primary/10 group-hover:bg-primary border border-primary/40 cyber-clip-button text-[11px] font-mono font-bold text-primary group-hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                            <span>{t('readMore')}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
