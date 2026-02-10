"use client";

import { MAIN_NAVIGATION } from "@/lib/constants/navigation";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * consolidated Mobile-only floating Menu component.
 * Includes both the trigger and the menu content.
 */
export default function MobileMenu() {
    const [openId, setOpenId] = useState<string | null>(null);
    const tNav = useTranslations("navigation");
    const rectBase = "origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]";

    const getItemLabel = (name: string) => {
        const key = name.toLowerCase();
        return tNav.has(`items.${key}.label`) ? tNav(`items.${key}.label`) : name;
    }

    const getSubItemLabel = (parent: string, name: string) => {
        const parentKey = parent.toLowerCase();
        const childKey = name.toLowerCase();
        return tNav.has(`items.${parentKey}.items.${childKey}`)
            ? tNav(`items.${parentKey}.items.${childKey}`)
            : name;
    }

    return (
        <header className="fixed top-0 left-0 z-50 flex flex-col md:hidden">
            <nav className="relative">
                <Popover>
                    <div className={cn(
                        "flex items-center gap-3 w-fit rounded-2xl p-1 transition-all duration-300 relative z-[60]",
                        "translate-x-4 translate-y-4",
                        "bg-gray-200/80 has-[[data-state=open]]:shadow-lg backdrop-blur-md"
                    )}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                aria-label="Toggle menu"
                                className={cn(
                                    "peer cursor-pointer group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-800 transition",
                                )}
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg className="w-6 h-6 fill-current pointer-events-none" viewBox="0 0 24 24">
                                    {/* Corners: Scale away to clear space */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0")} x="4" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-75")} x="16" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-75")} x="4" y="16" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-150")} x="16" y="16" width="4" height="4" rx="1" />

                                    {/* Core: Mids converge and rotate into a diamond shape */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-y-[2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-emerald-400 group-data-[state=open]:rotate-45")} x="10" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-x-[-2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-emerald-400 group-data-[state=open]:rotate-45 delay-75")} x="16" y="10" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-y-[-2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-emerald-400 group-data-[state=open]:rotate-45 delay-150")} x="10" y="16" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-x-[2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-emerald-400 group-data-[state=open]:rotate-45 delay-75")} x="4" y="10" width="4" height="4" rx="1" />

                                    {/* Center: Bright anchor for the diamond core */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-[2.2] group-data-[state=open]:fill-emerald-400 group-data-[state=open]:rotate-45 delay-[200ms]")} x="10" y="10" width="4" height="4" rx="1" />
                                </svg>
                            </button>
                        </PopoverTrigger>

                        <PopoverContent
                            side="bottom"
                            align="start"
                            sideOffset={16}
                            className={cn(
                                "w-[100vw]! px-4! py-1!",
                                "max-h-[calc(100vh-6rem)]! overflow-y-auto scrollbar-none overscroll-contain no-doc-scroll",
                                "border-none bg-transparent shadow-none text-inherit"
                            )}
                        >
                            <div className="w-full border border-slate-200/60 p-2 flex flex-col space-y-8 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl">
                                {/* Consolidated Menu Content */}
                                <ul className="space-y-2 text-xl py-2">
                                    {MAIN_NAVIGATION.map((item) => {
                                        const hasSubItems = item.items && item.items.length > 0;
                                        const label = getItemLabel(item.name);

                                        return (
                                            <li key={item.href} className="cursor-pointer relative block">
                                                <Collapsible
                                                    open={hasSubItems && openId === item.href}
                                                    onOpenChange={(isOpen) => hasSubItems && setOpenId(isOpen ? item.href : null)}
                                                    className="group"
                                                >
                                                    {hasSubItems ? (
                                                        <CollapsibleTrigger asChild>
                                                            <div className={cn(
                                                                "relative z-10 flex justify-between items-center px-4 py-3 rounded-2xl transition duration-300",
                                                                "hover:bg-primary hover:text-white",
                                                                "data-[state=open]:bg-primary data-[state=open]:text-white"
                                                            )}>
                                                                <span className="flex-1 transition-colors duration-300 font-medium">
                                                                    {label}
                                                                </span>
                                                                <span className="p-2">
                                                                    <ChevronRight
                                                                        strokeWidth={2.5}
                                                                        className={cn(
                                                                            "w-5 h-5 transition-transform duration-500 ease-out",
                                                                            "group-data-[state=open]:rotate-90 text-slate-400 group-hover:text-white group-data-[state=open]:text-white"
                                                                        )}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </CollapsibleTrigger>
                                                    ) : (
                                                        <PopoverClose asChild>
                                                            <Link
                                                                href={item.href}
                                                                className={cn(
                                                                    "relative z-10 flex justify-between items-center px-4 py-3 rounded-2xl transition duration-300",
                                                                    "hover:bg-primary hover:text-white font-medium"
                                                                )}
                                                            >
                                                                <span className="flex-1">{label}</span>
                                                            </Link>
                                                        </PopoverClose>
                                                    )}

                                                    {hasSubItems && (
                                                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                            <ul className="pl-4 bg-white/60 rounded-xl mt-2 mb-2">
                                                                {item.items?.map((sub, idx) => (
                                                                    <li key={idx}>
                                                                        <PopoverClose asChild>
                                                                            <Link
                                                                                href={sub.href}
                                                                                className="block px-6 py-3 text-slate-600 hover:text-primary transition duration-300 text-lg"
                                                                            >
                                                                                {getSubItemLabel(item.name, sub.name)}
                                                                            </Link>
                                                                        </PopoverClose>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </CollapsibleContent>
                                                    )}
                                                </Collapsible>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </PopoverContent>

                        {/* Logo - visible when menu is open */}
                        <PopoverClose asChild>
                            <Link
                                href="/"
                                className={cn(
                                    "hidden items-center px-2 transition-opacity duration-300",
                                    "peer-data-[state=open]:flex"
                                )}
                            >
                                <div className="relative h-8 w-8 mr-2 transition-transform hover:scale-110">
                                    <Image
                                        src="/img/home/nav_ico.svg"
                                        alt="Dev Hub Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                        </PopoverClose>
                    </div>
                </Popover>
            </nav>
        </header >
    );
}
