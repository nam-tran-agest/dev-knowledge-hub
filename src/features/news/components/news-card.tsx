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
                <div className="h-48 relative overflow-hidden bg-[#050714]">
                    <Image
                        src={item.image}
                        alt={item.title || "News"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                        unoptimized={item.image.startsWith('http') && !item.image.toLowerCase().includes('dantri')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04060f]/90 via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 z-10">
                        <Badge className="bg-background/80 backdrop-blur-md border-primary/40 text-primary text-[10px] font-mono font-bold px-2.5 py-0.5 shadow-sm">
                            {item.categoryId ? tCategories(item.categoryId) : item.category}
                        </Badge>
                    </div>

                    <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[8px] uppercase tracking-widest text-primary/70 font-mono">
                        // DISPATCH
                    </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-1 space-y-3">
                    <TimeDisplay isoDate={item.isoDate} className="text-[10px] text-primary/50 font-mono tracking-wider" />
                    <div className="space-y-1.5 flex-1">
                        <h3 className="text-sm font-mono font-bold leading-snug text-white group-hover:text-primary transition-colors line-clamp-2 uppercase">
                            {item.title}
                        </h3>
                        <p className="text-xs font-mono text-primary/60 line-clamp-2 leading-relaxed">
                            {item.excerpt}
                        </p>
                    </div>
                    <div className="pt-3 border-t border-primary/20 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-primary/60 uppercase tracking-widest">// {item.author}</span>
                        <div className="text-xs font-mono font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                            <span>{t('readMore')}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
