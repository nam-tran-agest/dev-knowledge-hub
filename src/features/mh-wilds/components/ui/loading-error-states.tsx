import { Loader2, AlertCircle } from 'lucide-react';

export function LoadingState({ label }: { label: string }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                <p className="text-sm text-slate-500">Loading {label}...</p>
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
