"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-[99] bg-black/85 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        overlayClassName?: string,
        hideCloseButton?: boolean,
        hideHeaderBar?: boolean,
        tag?: string
    }
>(({ className, overlayClassName, hideCloseButton, hideHeaderBar = false, tag = "SYS_POPUP_WINDOW", children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay className={overlayClassName} />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 shadow-[0_0_50px_rgba(0,0,0,0.95)] duration-200",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "cyber-clip-lg border border-primary/40 bg-[#050714] backdrop-blur-3xl text-slate-200 relative overflow-hidden",
                hideHeaderBar ? "p-0" : "p-6 sm:p-8",
                className
            )}
            {...props}
        >
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Corner Brackets */}
            <div className="absolute inset-0 cyber-brackets pointer-events-none" />

            {!hideHeaderBar && (
                <>
                    {/* Top FUI Window Header Bar */}
                    <div className="absolute top-0 left-0 right-0 h-7 border-b border-primary/30 bg-primary/10 flex items-center justify-between px-4 pointer-events-none">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                                // {tag}
                            </span>
                        </div>
                        {/* Diagonal Hazard Hatching on Header */}
                        <div className="w-16 h-3 opacity-40 hazard-stripes-cyan" />
                    </div>

                    {/* Content Container (padded for header bar) */}
                    <div className="relative z-10 pt-4 flex flex-col gap-4">
                        {children}
                    </div>
                </>
            )}

            {hideHeaderBar && (
                <div className="relative z-10 w-full h-full flex flex-col">
                    {children}
                </div>
            )}

            {!hideCloseButton && !hideHeaderBar && (
                <DialogPrimitive.Close className="absolute right-3 top-1 z-20 cyber-clip-button opacity-70 transition-all hover:opacity-100 hover:bg-destructive/20 hover:text-destructive p-1 focus:outline-none text-primary/70 cursor-pointer">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2 pt-2 border-t border-primary/20", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2", className)}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-xs font-mono text-primary/60 uppercase tracking-wide", className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
