import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { NewsItem } from './types';

export function FeaturedArticle({ item }: { item: NewsItem }) {
    return (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative block h-[500px] rounded-3xl overflow-hidden group ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent z-10" />
            <div className="absolute inset-0">
                <Image
                    src={item.image}
                    alt={item.title || "Featured"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    unoptimized={item.image.startsWith('http')}
                />
            </div>
            <div className="absolute bottom-10 left-10 right-10 z-20 space-y-6">
                <div className="space-y-4">
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">SỰ KIỆN NỔI BẬT</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">{item.title}</h1>
                    <p className="text-slate-400 max-w-2xl text-lg leading-relaxed line-clamp-2">{item.excerpt}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-emerald-500/50">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.author}`} />
                            <AvatarFallback>VN</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <div className="font-bold">Ban biên tập</div>
                            <div className="text-slate-500 text-xs uppercase font-bold">{item.author}</div>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-8 bg-white/10" />
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                        <Clock className="w-4 h-4" /> {item.time}
                    </div>
                    <div className="ml-auto p-3 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-full transition-all border border-white/5">
                        <ExternalLink className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </a>
    );
}
