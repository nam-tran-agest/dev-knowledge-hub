import * as React from "react"
import { cn } from "@/lib/utils/index"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full group">
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-primary/40 selection:bg-primary selection:text-primary-foreground",
          "cyber-clip-button border border-primary/30 bg-surface-deep/80 px-3.5 py-2 h-10 w-full min-w-0 text-sm font-mono text-slate-200 shadow-inner transition-all outline-none",
          "hover:border-primary/60 focus:border-primary focus:bg-primary/[0.04] focus:shadow-[0_0_15px_rgba(0,240,255,0.25)]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
          "aria-invalid:border-destructive aria-invalid:shadow-[0_0_15px_rgba(255,0,60,0.3)]",
          className
        )}
        {...props}
      />
      {/* Corner notch accent */}
      <span className="absolute top-0 right-0 w-2 h-0.5 bg-primary/40 pointer-events-none group-focus-within:bg-primary group-focus-within:shadow-[0_0_8px_var(--color-primary)]" />
    </div>
  )
}

export { Input }
