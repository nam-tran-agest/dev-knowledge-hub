import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from "@radix-ui/react-slot";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: 'primary' | 'destructive' | 'outline' | 'ghost';
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
    ({ className, variant = 'primary', asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        
        const baseStyles = "relative inline-flex items-center justify-center px-6 py-2 text-sm font-mono font-bold uppercase tracking-widest cyber-clip-button transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 overflow-hidden";
        
        const variants = {
            primary: "bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:border-primary cyber-scanline",
            destructive: "bg-destructive/10 text-destructive border border-destructive/50 hover:bg-destructive/20 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:border-destructive cyber-scanline",
            outline: "bg-transparent border border-primary/30 text-primary hover:bg-primary/10",
            ghost: "bg-transparent text-primary hover:bg-primary/10 cyber-clip-button"
        };

        return (
            <Comp
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            >
                {/* Tech Corners inside button */}
                <span className="absolute top-0 left-0 w-2 h-0.5 bg-current opacity-50" />
                <span className="absolute bottom-0 right-0 w-2 h-0.5 bg-current opacity-50" />
                
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </Comp>
        );
    }
);
CyberButton.displayName = "CyberButton";
