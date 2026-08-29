'use client'

import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { MAIN_NAVIGATION } from '@/lib/constants'
import { useTranslations } from 'next-intl'
import React from 'react'

export function MainNav() {
    const pathname = usePathname()
    const t = useTranslations()

    const getItemLabel = (name: string) => {
        const key = name.toLowerCase()
        return t.has(`navigation.items.${key}.label`)
            ? t(`navigation.items.${key}.label`)
            : name
    }

    const getSubItemLabel = (parent: string, name: string) => {
        const parentKey = parent.toLowerCase()
        const childKey = name.toLowerCase()
        return t.has(`navigation.items.${parentKey}.items.${childKey}`)
            ? t(`navigation.items.${parentKey}.items.${childKey}`)
            : name
    }

    return (
        <NavigationMenu className="p-1 rounded-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-md">
            <NavigationMenuList className="gap-1">
                {MAIN_NAVIGATION.map((item) => {
                    const isParentActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                        <NavigationMenuItem key={item.href}>
                            {item.items ? (
                                <>
                                    <NavigationMenuTrigger
                                        className={cn(
                                            "bg-transparent text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer",
                                            isParentActive
                                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                                                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                                        )}
                                    >
                                        {getItemLabel(item.name)}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[380px] gap-2 p-3 md:w-[480px] md:grid-cols-2 rounded-2xl bg-[#040711]/95 border border-white/10 backdrop-blur-2xl shadow-2xl">
                                            {item.items.map((subItem) => (
                                                <ListItem
                                                    key={subItem.href}
                                                    title={getSubItemLabel(item.name, subItem.name)}
                                                    href={subItem.href}
                                                    active={pathname === subItem.href}
                                                />
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer",
                                            isParentActive
                                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                                                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                                        )}
                                    >
                                        {getItemLabel(item.name)}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & { active?: boolean }
>(({ className, title, children, active, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href as string}
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-200 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white group",
                        active && "bg-indigo-500/15 border-indigo-500/30 text-indigo-300 shadow-sm",
                        className
                    )}
                    {...props}
                >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 flex items-center justify-between">
                        <span>{title}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity text-xs">→</span>
                    </div>
                    {children && (
                        <p className="line-clamp-2 text-[11px] leading-snug text-slate-400 mt-1">
                            {children}
                        </p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
