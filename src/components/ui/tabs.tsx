"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-11 items-center justify-center cyber-clip bg-[#060814]/90 p-1 border border-primary/30 text-primary/60 backdrop-blur-xl gap-1",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap cyber-clip-button px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-transparent",
            "text-primary/60 hover:text-white hover:bg-primary/10",
            "data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/60 data-[state=active]:shadow-[0_0_15px_rgba(0,240,255,0.3)]",
            "disabled:pointer-events-none disabled:opacity-40",
            className
        )}
        {...props}
    >
        <span className="relative z-10 flex items-center gap-1.5">
            {children}
        </span>
    </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-4 focus-visible:outline-none",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
