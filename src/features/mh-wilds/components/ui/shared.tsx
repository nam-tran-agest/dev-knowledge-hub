// === Shared UI helpers for MHWilds ===
// Merged from: grid-layout, group-header, rarity-dots, loading-error-states, pagination

import type { ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { RARITY_COLORS } from '../../constants';

// ─── Grid Layout ────────────────────────────────────────────
const GRID_CLS = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
    3: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
} as const;

export function GridLayout({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
    return <div className={GRID_CLS[cols]}>{children}</div>;
}

// ─── Group Header ───────────────────────────────────────────
export function GroupHeader({ label, count, iconNode }: { label: string; count: number; iconNode?: ReactNode }) {
    return (
        <div className="col-span-full flex items-center gap-3 pt-4 pb-2 first:pt-0">
            {iconNode && <span className="shrink-0">{iconNode}</span>}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-slate-600 bg-white/[0.03] rounded-full px-2 py-0.5">{count}</span>
        </div>
    );
}

// ─── Rarity Dots ────────────────────────────────────────────
export function RarityDots({ rarity }: { rarity: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: Math.min(rarity, 10) }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${RARITY_COLORS[rarity] || 'bg-slate-600'}`} />
            ))}
        </div>
    );
}

// ─── Skeleton Loading ───────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-[#111114] border border-white/5 rounded-xl p-5 animate-pulse">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-white/[0.04] rounded w-full" />
                <div className="h-3 bg-white/[0.04] rounded w-5/6" />
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.03]">
                <div className="h-5 bg-white/[0.04] rounded-full w-16" />
                <div className="h-5 bg-white/[0.04] rounded-full w-20" />
            </div>
        </div>
    );
}

export function LoadingState({ label }: { label: string }) {
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                <p className="text-sm text-slate-500">Loading {label}...</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
                <button onClick={onRetry} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Retry</button>
            </div>
        </div>
    );
}

// ─── Pagination ─────────────────────────────────────────────
export function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    const btnCls = 'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors';
    const defCls = `${btnCls} bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]`;
    return (
        <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
            <button disabled={current === 1} onClick={() => onChange(current - 1)} className={`${defCls} disabled:opacity-30 disabled:cursor-not-allowed`}>←</button>
            {start > 1 && <><button onClick={() => onChange(1)} className={defCls}>1</button>{start > 2 && <span className="text-slate-600 text-xs">…</span>}</>}
            {pages.map(p => (
                <button key={p} onClick={() => onChange(p)} className={p === current ? `${btnCls} bg-emerald-500 text-white shadow-lg shadow-emerald-500/25` : defCls}>{p}</button>
            ))}
            {end < total && <>{end < total - 1 && <span className="text-slate-600 text-xs">…</span>}<button onClick={() => onChange(total)} className={defCls}>{total}</button></>}
            <button disabled={current === total} onClick={() => onChange(current + 1)} className={`${defCls} disabled:opacity-30 disabled:cursor-not-allowed`}>→</button>
        </div>
    );
}
