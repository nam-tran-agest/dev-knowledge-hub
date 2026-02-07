'use client';

import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function NewsHeaderControls() {
    return (
        <div className="bg-[#0a0a0c]/80 backdrop-blur-md px-8 py-4 flex items-center gap-4 z-20 border-b border-white/5">
            <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-2 rounded-full hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="relative flex-1 max-w-xl text-slate-200">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm bài viết, tin tức và nhận định..."
                    className="w-full bg-[#1e1e24] border-none rounded-md py-2 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500 outline-none text-slate-200 placeholder:text-slate-500"
                />
            </div>
            <div className="flex gap-2 shrink-0">
                <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-white/10">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
