'use client';

import React, { useEffect } from 'react';
import { X, Terminal } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-start justify-end font-mono">
            <div className="absolute inset-0 bg-[#04060f]/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative h-full w-full max-w-xl bg-[#050714] backdrop-blur-2xl border-l border-primary/30 overflow-y-auto animate-in slide-in-from-right duration-300 custom-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.9)]">
                {/* Header HUD Tag */}
                <div className="sticky top-0 z-20 bg-[#050714]/95 backdrop-blur-xl border-b border-primary/20 p-5 flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                            {icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-primary" />
                                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
                            </div>
                            {subtitle && <div className="mt-0.5">{subtitle}</div>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 cyber-clip-button hover:bg-primary/20 text-primary/70 hover:text-white border border-primary/30 transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-2.5 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary/80 border-b border-primary/20 pb-2">// {title}</h4>
            {children}
        </div>
    );
}

export function StatRow({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-primary/10 last:border-0 font-mono">
            <span className="text-xs text-primary/60 uppercase">// {label}</span>
            <span className="text-xs font-bold text-slate-200">{value}</span>
        </div>
    );
}

/** Shared stat panel used inside detail drawers */
export const DETAIL_PANEL_CLS = 'bg-[#04060f]/80 border border-primary/20 cyber-clip p-4';
