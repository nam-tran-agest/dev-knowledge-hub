import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'danger' | 'ghost';
    label?: string;
    cornerIcon?: React.ReactNode;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
    ({ className, variant = 'default', label, cornerIcon, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative group cyber-clip bg-card border border-primary/20",
                    "hover:border-primary/50 transition-colors duration-300",
                    variant === 'danger' && "border-destructive/20 hover:border-destructive/50",
                    variant === 'ghost' && "bg-transparent border-dashed",
                    className
                )}
                {...props}
            >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff0a_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />

                {/* Brackets */}
                <div className={cn(
                    "absolute inset-0 cyber-brackets pointer-events-none",
                    variant === 'danger' && "cyber-brackets-red"
                )} />

                {/* Optional FUI Label */}
                {label && (
                    <div className="absolute top-0 right-4 -translate-y-1/2 px-2 bg-background border-x border-primary/30 text-[10px] uppercase tracking-widest text-primary/70 font-mono">
                        // {label}
                    </div>
                )}

                {/* Tech Accents */}
                <div className="absolute bottom-2 left-2 flex gap-1 pointer-events-none">
                    <div className="w-1 h-1 bg-primary/40" />
                    <div className="w-3 h-1 bg-primary/40" />
                </div>
                
                {cornerIcon && (
                    <div className="absolute top-2 right-2 text-primary/50 pointer-events-none">
                        {cornerIcon}
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 p-4 h-full">
                    {children}
                </div>
            </div>
        );
    }
);
CyberCard.displayName = "CyberCard";
