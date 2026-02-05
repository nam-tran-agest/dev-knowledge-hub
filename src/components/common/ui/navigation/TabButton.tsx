'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import React, { forwardRef } from 'react';
import { Button } from "@/components/ui/button";

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive: boolean;
    icon?: LucideIcon;
    children: React.ReactNode;
}

const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
    ({ isActive, icon: Icon, children, className, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant="ghost"
                className={cn(
                    "flex items-center gap-2 px-6 py-6 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap snap-start border backdrop-blur-md",
                    isActive
                        ? "bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 hover:bg-white hover:text-slate-950"
                        : "bg-slate-900/40 text-slate-200 border-white/10 hover:bg-slate-900/60 hover:text-white hover:border-white/30",
                    className
                )}
                {...props}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {children}
            </Button>
        );
    }
);

TabButton.displayName = 'TabButton';

export default TabButton;
