export function GroupHeader({ label, count, iconNode }: { label: string; count: number; iconNode?: React.ReactNode }) {
    return (
        <div className="col-span-full flex items-center gap-3 pt-4 pb-2 first:pt-0">
            {iconNode && <span className="shrink-0">{iconNode}</span>}
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-slate-600 bg-white/[0.03] rounded-full px-2 py-0.5">{count}</span>
        </div>
    );
}
