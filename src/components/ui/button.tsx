import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-mono font-bold uppercase tracking-widest cyber-clip-button transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 overflow-hidden cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:border-primary cyber-scanline",
                destructive:
                    "bg-destructive/10 text-destructive border border-destructive/50 hover:bg-destructive/20 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:border-destructive cyber-scanline",
                outline:
                    "bg-transparent border border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-sm",
                secondary:
                    "bg-secondary/20 text-secondary-foreground hover:bg-secondary/40 border border-secondary/50",
                ghost: "bg-transparent text-primary hover:bg-primary/10",
                link: "text-primary underline-offset-4 hover:underline cyber-clip-none font-sans normal-case",
                cta: "bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-primary)] cyber-scanline",
                ctaOutline: "border border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary font-semibold backdrop-blur-md",
                premium: "bg-gradient-to-r from-primary/20 via-secondary-foreground/20 to-accent-foreground/20 text-primary border border-primary/50 font-bold shadow-[0_0_15px_var(--color-primary)] hover:shadow-[0_0_25px_var(--color-primary)] cyber-scanline",
                glass: "bg-background/20 border border-primary/20 text-primary hover:bg-background/40 hover:border-primary/50 backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_var(--color-primary)]",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-8 px-4 text-xs",
                lg: "h-12 px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        if (asChild) {
            return (
                <Comp
                    className={cn(buttonVariants({ variant, size, className }))}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Comp>
            )
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {variant !== 'link' && (
                    <>
                        <span className="absolute top-0 left-0 w-2 h-0.5 bg-current opacity-50 pointer-events-none" />
                        <span className="absolute bottom-0 right-0 w-2 h-0.5 bg-current opacity-50 pointer-events-none" />
                    </>
                )}
                <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                    {children}
                </span>
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
