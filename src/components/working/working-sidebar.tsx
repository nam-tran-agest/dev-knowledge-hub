"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, PauseCircle, AlertCircle, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WorkingSidebar() {
    const tNav = useTranslations('navigation.items.working');
    const params = useParams();
    const currentStatus = params.status?.[0] || 'all';

    const menuItems = [
        { id: 'all', label: tNav('label'), href: '/working', icon: <LayoutGrid className="w-4 h-4" /> },
        { id: 'active', label: tNav('items.active'), href: '/working/active', icon: <PlayCircle className="w-4 h-4" /> },
        { id: 'paused', label: tNav('items.paused'), href: '/working/paused', icon: <PauseCircle className="w-4 h-4" /> },
        { id: 'blocked', label: tNav('items.blocked'), href: '/working/blocked', icon: <AlertCircle className="w-4 h-4" /> },
    ];

    return (
        <aside className="w-full lg:w-64 min-w-0 bg-[#0a0a0c]/50 backdrop-blur-xl border-b lg:border-r border-white/5 flex flex-col shrink-0">
            {/* Mobile View */}
            <div className="lg:hidden p-4 border-b border-white/5 w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                    {menuItems.map((item) => {
                        const isActive = item.id === currentStatus;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border text-xs font-bold",
                                    isActive
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-slate-400 border-white/10 hover:bg-white/5"
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Desktop View */}
            <ScrollArea className="hidden lg:block h-full">
                <div className="p-6 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2">
                            Navigation
                        </h3>
                        <div className="space-y-1">
                            {menuItems.map((item) => {
                                const isActive = item.id === currentStatus;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                                            isActive
                                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "transition-colors",
                                            isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300"
                                        )}>
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-bold">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
