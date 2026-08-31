"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "z-[10005] w-72 cyber-clip border border-primary/30 bg-surface/95 p-4 text-slate-100 shadow-[0_0_25px_rgba(0,0,0,0.9)] backdrop-blur-2xl outline-none transition-all duration-150",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverClose = PopoverPrimitive.Close

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose }
