import React from 'react';
import { cn } from '@/lib/utils';

interface CyberBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'destructive' | 'warning' | 'success';
}

export const CyberBadge = React.forwardRef<HTMLDivElement, CyberBadgeProps>(
    ({ className, variant = 'primary', children, ...props }, ref) => {
        const variantColors = {
            primary: "text-primary border-primary",
            destructive: "text-destructive border-destructive",
            warning: "text-yellow-400 border-yellow-400",
            success: "text-green-400 border-green-400"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                    "bg-background/50 backdrop-blur-sm border-l-2",
                    variantColors[variant],
                    className
                )}
                {...props}
            >
                {/* Segmented Decorator */}
                <div className="flex gap-[2px] opacity-60">
                    <div className={cn("w-1 h-2", `bg-${variant === 'primary' ? 'primary' : variant}`)} style={{ backgroundColor: 'currentColor' }} />
                    <div className={cn("w-0.5 h-2", `bg-${variant === 'primary' ? 'primary' : variant}`)} style={{ backgroundColor: 'currentColor' }} />
                    <div className={cn("w-0.5 h-2", `bg-${variant === 'primary' ? 'primary' : variant}`)} style={{ backgroundColor: 'currentColor' }} />
                </div>
                <span>{children}</span>
                {/* Closing Bracket */}
                <span className="opacity-50">]</span>
                <span className="absolute left-1 top-0 bottom-0 flex items-center opacity-50 -translate-x-full">
                    [
                </span>
            </div>
        );
    }
);
CyberBadge.displayName = "CyberBadge";
