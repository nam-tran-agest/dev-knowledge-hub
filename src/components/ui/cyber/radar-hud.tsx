import React from 'react';
import { cn } from '@/lib/utils';

export function RadarHUD({ className }: { className?: string }) {
    return (
        <div className={cn("relative w-32 h-32 flex items-center justify-center", className)}>
            {/* Outer Target Circle */}
            <div className="absolute inset-0 border border-primary/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-2 border-2 border-primary/10 rounded-full border-t-primary/50 animate-[spin_4s_linear_infinite]" />
            
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-primary/20" />
                <div className="absolute h-full w-[1px] bg-primary/20" />
            </div>

            {/* Scanning Line */}
            <div 
                className="absolute inset-4 rounded-full overflow-hidden opacity-50"
                style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
            >
                <div className="w-full h-full bg-gradient-to-r from-transparent to-primary/40 origin-left animate-[spin_2s_linear_infinite]" />
            </div>
            
            {/* Center Core */}
            <div className="w-4 h-4 bg-primary/30 rounded-full shadow-[0_0_15px_var(--color-primary)] animate-pulse" />
            <div className="absolute w-2 h-2 bg-primary rounded-full" />
            
            {/* Decorative Nodes */}
            <div className="absolute top-0 w-2 h-2 bg-primary/60 -translate-y-1" />
            <div className="absolute bottom-0 w-2 h-2 bg-primary/60 translate-y-1" />
            <div className="absolute left-0 w-2 h-2 bg-primary/60 -translate-x-1" />
            <div className="absolute right-0 w-2 h-2 bg-primary/60 translate-x-1" />
        </div>
    );
}
