// === Shared UI helpers for MHWilds ===
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
            {iconNode && <span className="shrink-0 text-primary">{iconNode}</span>}
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">// {label}</h3>
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 cyber-clip-tag">
                [ {count} ]
            </span>
        </div>
    );
}

// ─── Rarity Dots ────────────────────────────────────────────
export function RarityDots({ rarity }: { rarity: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: Math.min(rarity, 10) }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 cyber-clip-sm ${RARITY_COLORS[rarity] || 'bg-primary/40'}`} />
            ))}
        </div>
    );
}

// ─── Skeleton Loading ───────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-card/60 border border-primary/20 cyber-clip p-5 animate-pulse relative overflow-hidden">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 cyber-clip-button bg-primary/10" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-primary/10 cyber-clip-tag w-3/4" />
                    <div className="h-3 bg-primary/5 cyber-clip-tag w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-primary/5 cyber-clip-tag w-full" />
                <div className="h-3 bg-primary/5 cyber-clip-tag w-5/6" />
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-primary/10">
                <div className="h-5 bg-primary/10 cyber-clip-tag w-16" />
                <div className="h-5 bg-primary/10 cyber-clip-tag w-20" />
            </div>
        </div>
    );
}

export function LoadingState({ label }: { label: string }) {
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-2 font-mono text-xs text-primary">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <p className="uppercase tracking-wider">// QUERYING_VAULT: {label}...</p>
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
            <div className="flex flex-col items-center gap-3 text-center cyber-clip p-8 border border-destructive/40 bg-card/80">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <p className="text-xs font-mono text-destructive uppercase tracking-wider">// ERROR: {error}</p>
                <button onClick={onRetry} className="px-4 py-2 bg-destructive text-white cyber-clip-button text-xs font-mono uppercase tracking-widest hover:bg-destructive/90 transition-colors cursor-pointer">
                    [ RETRY_QUERY ]
                </button>
            </div>
        </div>
    );
}
