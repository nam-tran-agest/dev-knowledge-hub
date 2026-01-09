import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 transition-all",
                "bg-white/6 border border-white/8",
                "focus:outline-none focus:bg-white/8 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
