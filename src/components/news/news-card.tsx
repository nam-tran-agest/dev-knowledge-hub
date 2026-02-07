import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Share2, ChevronRight } from 'lucide-react';
import { NewsItem } from '@/types/news';

export function NewsCard({ item }: { item: NewsItem }) {
    return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
            <Card className="bg-[#111114] border-white/5 overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col h-full">
                <div className="h-52 relative overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title || "News"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-emerald-400 font-bold">{item.category}</Badge>
                    </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.time}</span>
                        <div className="flex gap-2">
                            <Bookmark className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                            <Share2 className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-bold leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.author}</span>
                        <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 group/btn hover:underline">
                            ĐỌC THÊM <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
