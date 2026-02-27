import React, { useEffect } from 'react';
import { X } from 'lucide-react';

// === Shared Drawer Primitives ===

export function DrawerLayout({ title, icon, onClose, children, subtitle }: { title: string, icon: React.ReactNode, subtitle?: React.ReactNode, onClose: () => void, children: React.ReactNode }) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative h-full w-full max-w-xl bg-[#151210]/95 backdrop-blur-xl border-l border-[#c8a97e]/15 overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 z-10 bg-[#151210]/90 backdrop-blur-xl border-b border-[#c8a97e]/15 p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            {subtitle && <div className="mt-1">{subtitle}</div>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="p-6 space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-3">{title}</h4>
            {children}
        </div>
    );
}

export function StatRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-200">{value}</span>
        </div>
    );
}

/** Shared stat panel used inside detail drawers */
export const DETAIL_PANEL_CLS = 'bg-[#1c1816]/60 border border-[#c8a97e]/10 rounded-xl p-4';
