export function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
    if (total <= 1) return null;
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
        <div className="flex items-center justify-center gap-1.5 pt-6 pb-2">
            <button disabled={current === 1} onClick={() => onChange(current - 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">←</button>
            {start > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white transition-colors">1</button>{start > 2 && <span className="text-slate-600 text-xs">…</span>}</>}
            {pages.map(p => (
                <button key={p} onClick={() => onChange(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${p === current ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]'}`}>{p}</button>
            ))}
            {end < total && <>{end < total - 1 && <span className="text-slate-600 text-xs">…</span>}<button onClick={() => onChange(total)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white transition-colors">{total}</button></>}
            <button disabled={current === total} onClick={() => onChange(current + 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">→</button>
        </div>
    );
}
