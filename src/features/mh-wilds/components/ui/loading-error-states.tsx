import { Loader2, AlertCircle } from 'lucide-react';

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
                {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
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

