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
                    "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]",
                destructive:
                    "bg-rose-600 text-white shadow-sm hover:bg-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]",
                outline:
                    "border border-white/10 bg-white/[0.02] text-slate-200 hover:bg-white/[0.06] hover:text-white hover:border-white/20 backdrop-blur-sm",
                secondary:
                    "bg-white/[0.06] text-slate-200 hover:bg-white/[0.12] hover:text-white border border-white/[0.08]",
                ghost: "text-slate-400 hover:bg-white/[0.06] hover:text-white",
                link: "text-indigo-400 underline-offset-4 hover:underline",
                cta: "bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]",
                ctaOutline: "border border-white/20 bg-white/[0.04] text-white rounded-full hover:bg-white/[0.08] hover:border-white/40 font-semibold backdrop-blur-md",
                premium: "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white !rounded-full font-bold shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_45px_rgba(99,102,241,0.6)]",
                glass: "bg-white/[0.04] border border-white/10 text-white rounded-full hover:bg-white/[0.08] hover:border-indigo-500/40 backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]",
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
