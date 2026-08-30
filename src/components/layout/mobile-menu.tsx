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
import { UserMenu } from "@/components/layout/user-menu";

export default function MobileMenu() {
    const [openId, setOpenId] = useState<string | null>(null);
    const tNav = useTranslations("navigation");

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
                        "flex items-center gap-3 w-fit cyber-clip p-1.5 transition-all duration-300 relative z-[60]",
                        "translate-x-4 translate-y-4",
                        "bg-[#04060f]/95 border border-primary/40 has-[[data-state=open]]:border-primary backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                    )}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                aria-label="Toggle menu"
                                className={cn(
                                    "peer cursor-pointer group flex h-10 w-10 shrink-0 items-center justify-center cyber-clip-button bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 transition",
                                )}
                            >
                                <span className="sr-only">Toggle menu</span>
                                <div className="space-y-1 w-4">
                                    <div className="h-0.5 bg-primary w-full group-hover:w-3 transition-all" />
                                    <div className="h-0.5 bg-primary w-3 group-hover:w-full transition-all" />
                                    <div className="h-0.5 bg-primary w-2 group-hover:w-4 transition-all" />
                                </div>
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
                            <div className="w-full border border-primary/40 p-4 flex flex-col space-y-4 cyber-clip bg-[#050714]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.9)] text-slate-200 relative">
                                <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[9px] uppercase tracking-widest text-primary/70 font-mono">
                                    // SYS_MOBILE_DRAWER
                                </div>
                                <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50" />

                                <ul className="space-y-1.5 text-sm py-2">
                                    {MAIN_NAVIGATION.map((item, idx) => {
                                        const hasSubItems = item.items && item.items.length > 0;
                                        const label = getItemLabel(item.name);
                                        const itemIndex = `0${idx + 1}`;

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
                                                                "relative z-10 flex justify-between items-center px-4 py-2.5 cyber-clip-button transition duration-200 cursor-pointer border border-primary/10",
                                                                "hover:bg-primary/10 hover:border-primary/40 text-white font-mono uppercase tracking-wider text-xs",
                                                                "data-[state=open]:bg-primary/20 data-[state=open]:text-primary data-[state=open]:border-primary/50"
                                                            )}>
                                                                <span className="flex-1 font-semibold flex items-center gap-2">
                                                                    <span className="text-primary/50 text-[10px]">{itemIndex}.</span>
                                                                    {label}
                                                                </span>
                                                                <ChevronRight
                                                                    strokeWidth={2.5}
                                                                    className={cn(
                                                                        "w-4 h-4 transition-transform duration-300 ease-out text-primary/60",
                                                                        "group-data-[state=open]:rotate-90 group-data-[state=open]:text-primary"
                                                                    )}
                                                                />
                                                            </div>
                                                        </CollapsibleTrigger>
                                                    ) : (
                                                        <PopoverClose asChild>
                                                            <Link
                                                                href={item.href}
                                                                className={cn(
                                                                    "relative z-10 flex justify-between items-center px-4 py-2.5 cyber-clip-button transition duration-200 border border-primary/10",
                                                                    "hover:bg-primary/10 hover:border-primary/40 text-white font-mono uppercase tracking-wider text-xs"
                                                                )}
                                                            >
                                                                <span className="flex-1 flex items-center gap-2">
                                                                    <span className="text-primary/50 text-[10px]">{itemIndex}.</span>
                                                                    {label}
                                                                </span>
                                                                <span className="text-primary/50 text-xs">▶</span>
                                                            </Link>
                                                        </PopoverClose>
                                                    )}

                                                    {hasSubItems && (
                                                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                                                            <ul className="pl-4 bg-primary/[0.03] border-l-2 border-primary/40 my-1 py-1 space-y-1">
                                                                {item.items?.map((sub, sIdx) => (
                                                                    <li key={sIdx}>
                                                                        <PopoverClose asChild>
                                                                            <Link
                                                                                href={sub.href}
                                                                                className="block px-3 py-2 text-primary/70 hover:text-white hover:bg-primary/10 cyber-clip-button transition duration-200 text-xs font-mono uppercase tracking-wide"
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

                                <div className="pt-3 border-t border-primary/20 flex items-center justify-between px-2">
                                    <div className="flex items-center gap-2">
                                        <LanguageSwitcher />
                                    </div>
                                    <UserMenu />
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
                                <div className="relative h-6 w-6 mr-2 transition-transform hover:scale-110">
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
