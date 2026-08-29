import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90 hover:shadow-[0_0_25px_var(--color-primary)]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-[0_0_20px_var(--color-destructive)]",
                outline:
                    "border border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/60 backdrop-blur-sm",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary",
                ghost: "text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                cta: "bg-primary text-black font-bold rounded-full hover:bg-primary/90 shadow-xl hover:shadow-[0_0_25px_var(--color-primary)]",
                ctaOutline: "border border-primary/50 bg-primary/5 text-primary rounded-full hover:bg-primary/10 hover:border-primary font-semibold backdrop-blur-md",
                premium: "bg-gradient-to-r from-primary via-secondary-foreground to-accent-foreground text-black !rounded-full font-bold shadow-[0_0_30px_var(--color-primary)] hover:shadow-[0_0_45px_var(--color-primary)]",
                glass: "bg-background/20 border border-primary/20 text-primary rounded-full hover:bg-background/40 hover:border-primary/50 backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_var(--color-primary)]",
            },
            size: {
                default: "h-10 px-4 py-2 text-sm",
                sm: "h-8 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-9 w-9 rounded-xl",
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
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
