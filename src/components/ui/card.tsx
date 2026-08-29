import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative group cyber-clip glass-panel border border-primary/20",
            "hover:border-primary/50 hover:shadow-[0_0_20px_var(--color-primary)] transition-all duration-300",
            className
        )}
        {...props}
    >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff0a_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff0a_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-20 pointer-events-none" />

        {/* Brackets */}
        <div className="absolute inset-0 cyber-brackets pointer-events-none" />

        {/* Tech Accents */}
        <div className="absolute bottom-2 left-2 flex gap-1 pointer-events-none opacity-50">
            <div className="w-1 h-1 bg-primary" />
            <div className="w-3 h-1 bg-primary" />
        </div>

        {/* Real Content container to stack above decorations */}
        <div className="relative z-10 w-full h-full flex flex-col">
            {props.children}
        </div>
    </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-5 relative", className)}
        {...props}
    >
        {/* Little FUI tag in header */}
        <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[10px] uppercase tracking-widest text-primary/70 font-mono pointer-events-none">
            // DATA_BLK
        </div>
        {props.children}
    </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "text-lg font-bold uppercase tracking-wide text-white font-mono",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm text-primary/60 font-mono uppercase tracking-wider", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0 flex-1", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-5 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
