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

import { LanguageSwitcher } from "@/components/layout/language-switcher";

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
                        "flex items-center gap-3 w-fit rounded-2xl p-1.5 transition-all duration-300 relative z-[60]",
                        "translate-x-4 translate-y-4",
                        "bg-popover border border-white/10 has-[[data-state=open]]:border-indigo-500/50 backdrop-blur-xl shadow-2xl"
                    )}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                aria-label="Toggle menu"
                                className={cn(
                                    "peer cursor-pointer group flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] transition",
                                )}
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg className="w-5 h-5 fill-current pointer-events-none text-slate-300" viewBox="0 0 24 24">
                                    {/* Corners */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0")} x="4" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-75")} x="16" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-75")} x="4" y="16" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-0 delay-150")} x="16" y="16" width="4" height="4" rx="1" />

                                    {/* Core */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-y-[2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-indigo-400 group-data-[state=open]:rotate-45")} x="10" y="4" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-x-[-2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-indigo-400 group-data-[state=open]:rotate-45 delay-75")} x="16" y="10" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-y-[-2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-indigo-400 group-data-[state=open]:rotate-45 delay-150")} x="10" y="16" width="4" height="4" rx="1" />
                                    <rect className={cn(rectBase, "group-data-[state=open]:translate-x-[2px] group-data-[state=open]:scale-[1.8] group-data-[state=open]:fill-indigo-400 group-data-[state=open]:rotate-45 delay-75")} x="4" y="10" width="4" height="4" rx="1" />

                                    {/* Center */}
                                    <rect className={cn(rectBase, "group-data-[state=open]:scale-[2.2] group-data-[state=open]:fill-indigo-400 group-data-[state=open]:rotate-45 delay-[200ms]")} x="10" y="10" width="4" height="4" rx="1" />
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
                            <div className="w-full border border-white/10 p-3 flex flex-col space-y-4 rounded-3xl bg-background/95 backdrop-blur-2xl shadow-2xl text-slate-200">
                                <ul className="space-y-1.5 text-base py-2">
                                    {MAIN_NAVIGATION.map((item) => {
                                        const hasSubItems = item.items && item.items.length > 0;
                                        const label = getItemLabel(item.name);

                                        return (
                                            <li key={item.href} className="relative block">
                                                <Collapsible
                                                    open={hasSubItems && openId === item.href}
                                                    onOpenChange={(isOpen) => hasSubItems && setOpenId(isOpen ? item.href : null)}
                                                    className="group"
                                                >
                                                    {hasSubItems ? (
                                                        <CollapsibleTrigger asChild>
                                                            <div className={cn(
                                                                "relative z-10 flex justify-between items-center px-4 py-3 rounded-2xl transition duration-200 cursor-pointer",
                                                                "hover:bg-white/[0.06] text-white",
                                                                "data-[state=open]:bg-indigo-500/20 data-[state=open]:text-indigo-300"
                                                            )}>
                                                                <span className="flex-1 font-medium">
                                                                    {label}
                                                                </span>
                                                                <ChevronRight
                                                                    strokeWidth={2.5}
                                                                    className={cn(
                                                                        "w-4 h-4 transition-transform duration-300 ease-out text-slate-400",
                                                                        "group-data-[state=open]:rotate-90 group-data-[state=open]:text-indigo-300"
                                                                    )}
                                                                />
                                                            </div>
                                                        </CollapsibleTrigger>
                                                    ) : (
                                                        <PopoverClose asChild>
                                                            <Link
                                                                href={item.href}
                                                                className={cn(
                                                                    "relative z-10 flex justify-between items-center px-4 py-3 rounded-2xl transition duration-200",
                                                                    "hover:bg-white/[0.06] text-white font-medium"
                                                                )}
                                                            >
                                                                <span className="flex-1">{label}</span>
                                                            </Link>
                                                        </PopoverClose>
                                                    )}

                                                    {hasSubItems && (
                                                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                            <ul className="pl-4 bg-white/[0.02] border border-white/5 rounded-2xl mt-1.5 mb-2 py-1 space-y-1">
                                                                {item.items?.map((sub, idx) => (
                                                                    <li key={idx}>
                                                                        <PopoverClose asChild>
                                                                            <Link
                                                                                href={sub.href}
                                                                                className="block px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-xl transition duration-200 text-sm font-medium"
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

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between px-2">
                                    <span className="text-xs font-mono text-slate-400">Language</span>
                                    <LanguageSwitcher />
                                </div>
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
                                <div className="relative h-7 w-7 mr-2 transition-transform hover:scale-110">
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
