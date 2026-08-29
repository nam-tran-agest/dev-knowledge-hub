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
        <NavigationMenu className="p-0">
            <NavigationMenuList className="gap-2">
                {MAIN_NAVIGATION.map((item) => {
                    const isParentActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                        <NavigationMenuItem key={item.href}>
                            {item.items ? (
                                <>
                                    <NavigationMenuTrigger
                                        className={cn(
                                            "bg-transparent text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer",
                                            isParentActive
                                                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                                        )}
                                    >
                                        {getItemLabel(item.name)}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[380px] gap-2 p-3 md:w-[480px] md:grid-cols-2 rounded-2xl bg-popover border border-border backdrop-blur-2xl shadow-2xl">
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
                                            "inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer",
                                            isParentActive
                                                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
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
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-200 border border-transparent hover:border-primary/30 hover:bg-primary/10 hover:text-foreground group",
                        active && "bg-primary/15 border-primary/30 text-primary shadow-[inset_0_0_15px_rgba(0,240,255,0.1)]",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{title}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity text-xs">→</span>
                    </div>
                    {children && (
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1.5">
                            {children}
                        </p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
