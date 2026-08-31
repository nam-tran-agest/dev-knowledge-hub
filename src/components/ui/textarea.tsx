import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <div className="relative w-full group">
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full cyber-clip-button px-3.5 py-2.5 text-sm font-mono text-slate-200 placeholder:text-primary/40 transition-all",
                    "bg-surface-deep/80 border border-primary/30",
                    "hover:border-primary/60 focus:outline-none focus:bg-primary/[0.04] focus:border-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.25)]",
                    "disabled:cursor-not-allowed disabled:opacity-40",
                    className
                )}
                ref={ref}
                {...props}
            />
            {/* Corner Notch */}
            <span className="absolute top-0 right-0 w-2 h-0.5 bg-primary/40 pointer-events-none group-focus-within:bg-primary group-focus-within:shadow-[0_0_8px_var(--color-primary)]" />
        </div>
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
