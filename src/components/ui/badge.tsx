import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils/index"

const badgeVariants = cva(
  "relative inline-flex items-center justify-center border-l-2 border-transparent px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden bg-background/50 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "text-primary border-primary hover:bg-primary/20",
        secondary: "text-secondary-foreground border-secondary hover:bg-secondary/20",
        destructive: "text-destructive border-destructive hover:bg-destructive/20",
        outline: "border-border text-foreground hover:bg-accent",
        ghost: "hover:bg-accent text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {/* Segmented FUI Decorator */}
      {!asChild && (
        <span className="flex gap-[2px] opacity-60 mr-1 pointer-events-none">
          <span className="w-1 h-2 bg-current" />
          <span className="w-0.5 h-2 bg-current" />
          <span className="w-0.5 h-2 bg-current" />
        </span>
      )}
      <span>{children}</span>
      {!asChild && (
        <span className="opacity-50 ml-1 pointer-events-none">]</span>
      )}
      {!asChild && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center opacity-50 -translate-x-full pointer-events-none">
          [
        </span>
      )}
    </Comp>
  )
}

export { Badge, badgeVariants }
