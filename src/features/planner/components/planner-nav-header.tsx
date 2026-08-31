'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Calendar, CalendarDays, Inbox, Cloud, Radio } from 'lucide-react';
import { usePlannerStore } from '@/features/planner/store/usePlannerStore';
import { usePlannerRealtime } from '../hooks/use-planner-realtime';

const TABS = [
    {
        id: 'today',
        label: 'TODAY // TIMELINE',
        href: '/planner/today',
        icon: Calendar,
        code: '01'
    },
    {
        id: 'week',
        label: 'WEEK // MATRIX',
        href: '/planner/week',
        icon: CalendarDays,
        code: '02'
    },
    {
        id: 'someday',
        label: 'SOMEDAY // BACKLOG',
        href: '/planner/someday',
        icon: Inbox,
        code: '03'
    },
];

export const PlannerNavHeader: React.FC = () => {
    const pathname = usePathname();
    const isSyncing = usePlannerStore(state => state.isSyncing);
    const { isConnected } = usePlannerRealtime();

    return (
        <div className="w-full border-b border-primary/20 bg-surface-deep/90 backdrop-blur-xl mb-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* View Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href || (tab.id === 'today' && (pathname === '/planner' || pathname === '/planner/today'));

                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider cyber-clip-button transition-all duration-300 border cursor-pointer",
                                    isActive
                                        ? "bg-primary text-black font-bold border-primary shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90"
                                        : "bg-primary/5 text-primary/70 border-primary/20 hover:bg-primary/15 hover:text-white hover:border-primary/40"
                                )}
                            >
                                <span className={cn("text-[10px]", isActive ? "text-black/60" : "text-primary/40")}>
                                    {tab.code}.
                                </span>
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Status Indicator with Live WebSockets */}
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 cyber-clip-button text-[10px] uppercase tracking-widest font-mono w-fit">
                        {isConnected ? (
                            <>
                                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                <span className="text-emerald-400">REALTIME_LIVE</span>
                            </>
                        ) : (
                            <>
                                <Cloud className={cn("w-3.5 h-3.5", isSyncing ? "animate-pulse text-cyan-400" : "text-primary/60")} />
                                <span className="text-primary/70">{isSyncing ? 'SYNCING_CLOUD' : 'SYSTEM_SYNCED'}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
