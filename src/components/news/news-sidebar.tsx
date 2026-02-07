import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { NewsItem, NewsCategory } from './types';

interface NewsSidebarProps {
    categories: NewsCategory[];
    trendingItems: NewsItem[];
}

export function NewsSidebar({ categories, trendingItems }: NewsSidebarProps) {
    return (
        <aside className="w-full lg:w-80 bg-[#111114] border-r border-white/5 flex flex-col overflow-hidden">
            <ScrollArea className="h-full">
                <div className="p-6 space-y-10">
                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">Chuyên mục</h3>
                        <div className="space-y-1">
                            {categories.map((cat, i) => (
                                <div key={i} className={`flex items-center gap-4 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${cat.active ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
                                    {cat.icon}
                                    <span className="text-sm font-bold">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* Trending from RSS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3" /> Xu hướng
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {trendingItems.map((news: NewsItem, i: number) => (
                                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group block px-2">
                                    <div className="flex items-center justify-between gap-4">
                                        <Badge variant="outline" className="text-[9px] h-4 bg-white/5 border-none text-slate-400">{news.category}</Badge>
                                        <span className="text-[10px] text-slate-500 font-bold">{news.time}</span>
                                    </div>
                                    <h4 className="text-sm font-bold mt-2 leading-tight group-hover:text-emerald-400 transition-colors line-clamp-2">{news.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{news.author}</p>
                                </a>
                            ))}
                        </div>
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded text-xs font-bold transition-colors text-slate-400">Xem tất cả xu hướng</button>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
