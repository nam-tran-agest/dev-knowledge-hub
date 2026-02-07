import { Newspaper } from 'lucide-react';
import { NewsCard } from './news-card';
import { NewsItem } from './types';

export function NewsGrid({ items }: { items: NewsItem[] }) {
    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-emerald-400" /> Tin mới nhất
                </h2>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors">Gần đây</button>
                    <button className="px-4 py-1.5 rounded-full hover:bg-white/5 text-xs font-bold text-slate-500 transition-colors">Phổ biến</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, i) => (
                    <NewsCard key={i} item={item} />
                ))}
            </div>
        </section>
    );
}
