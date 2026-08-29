'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CyberActionColor = 'cyan' | 'indigo' | 'emerald' | 'amber' | 'crimson';

interface TacticalActionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    moduleCode?: string;
    color?: CyberActionColor;
    size?: 'sm' | 'md' | 'lg';
}

const COLOR_MAP: Record<CyberActionColor, {
    borderDivider: string;
    codeText: string;
    btnBg: string;
    btnBorder: string;
    btnText: string;
    btnHoverBg: string;
    btnHoverText: string;
    btnHoverBorder: string;
    btnHoverShadow: string;
}> = {
    cyan: {
        borderDivider: 'border-cyan-500/20',
        codeText: 'text-cyan-400/60',
        btnBg: 'bg-cyan-500/10',
        btnBorder: 'border-cyan-400/40',
        btnText: 'text-cyan-300',
        btnHoverBg: 'group-hover:bg-cyan-400',
        btnHoverText: 'group-hover:text-black',
        btnHoverBorder: 'group-hover:border-cyan-400',
        btnHoverShadow: 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]',
    },
    indigo: {
        borderDivider: 'border-indigo-500/20',
        codeText: 'text-indigo-400/60',
        btnBg: 'bg-indigo-500/10',
        btnBorder: 'border-indigo-400/40',
        btnText: 'text-indigo-300',
        btnHoverBg: 'group-hover:bg-indigo-400',
        btnHoverText: 'group-hover:text-black',
        btnHoverBorder: 'group-hover:border-indigo-400',
        btnHoverShadow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]',
    },
    emerald: {
        borderDivider: 'border-emerald-500/20',
        codeText: 'text-emerald-400/60',
        btnBg: 'bg-emerald-500/10',
        btnBorder: 'border-emerald-400/40',
        btnText: 'text-emerald-300',
        btnHoverBg: 'group-hover:bg-emerald-400',
        btnHoverText: 'group-hover:text-black',
        btnHoverBorder: 'group-hover:border-emerald-400',
        btnHoverShadow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]',
    },
    amber: {
        borderDivider: 'border-amber-500/20',
        codeText: 'text-amber-400/60',
        btnBg: 'bg-amber-500/10',
        btnBorder: 'border-amber-400/40',
        btnText: 'text-amber-300',
        btnHoverBg: 'group-hover:bg-amber-400',
        btnHoverText: 'group-hover:text-black',
        btnHoverBorder: 'group-hover:border-amber-400',
        btnHoverShadow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    },
    crimson: {
        borderDivider: 'border-destructive/20',
        codeText: 'text-red-400/60',
        btnBg: 'bg-destructive/10',
        btnBorder: 'border-destructive/40',
        btnText: 'text-red-300',
        btnHoverBg: 'group-hover:bg-destructive',
        btnHoverText: 'group-hover:text-white',
        btnHoverBorder: 'group-hover:border-destructive',
        btnHoverShadow: 'group-hover:shadow-[0_0_20px_rgba(255,0,60,0.6)]',
    },
};

export function TacticalActionButton({
    label,
    moduleCode,
    color = 'cyan',
    size = 'md',
    className,
    ...props
}: TacticalActionButtonProps) {
    const scheme = COLOR_MAP[color] || COLOR_MAP.cyan;

    const sizeStyles = {
        sm: 'px-3 py-1 text-[10px]',
        md: 'px-3.5 py-1.5 text-xs',
        lg: 'px-4 py-2 text-xs',
    }[size];

    return (
        <div
            className={cn(
                "relative z-10 mt-8 flex items-center justify-between border-t pt-4",
                scheme.borderDivider,
                className
            )}
            {...props}
        >
            {moduleCode ? (
                <span className={cn("text-[11px] font-mono uppercase tracking-widest font-bold", scheme.codeText)}>
                    // {moduleCode}
                </span>
            ) : (
                <span />
            )}

            <div
                className={cn(
                    "inline-flex items-center gap-2 cyber-clip-button border font-mono uppercase font-bold tracking-wider transition-all duration-200",
                    scheme.btnBg,
                    scheme.btnBorder,
                    scheme.btnText,
                    scheme.btnHoverBg,
                    scheme.btnHoverText,
                    scheme.btnHoverBorder,
                    scheme.btnHoverShadow,
                    sizeStyles
                )}
            >
                <span>{label}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
        </div>
    );
}
