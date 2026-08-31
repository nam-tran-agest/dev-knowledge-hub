'use client'

import React from 'react'
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
            <NavigationMenuList className="gap-1.5 sm:gap-2">
                {MAIN_NAVIGATION.map((item, idx) => {
                    const isParentActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    const itemIndex = `0${idx + 1}`

                    return (
                        <NavigationMenuItem key={item.href}>
                            {item.items ? (
                                <>
                                    <NavigationMenuTrigger
                                        className={cn(
                                            "bg-transparent text-xs font-mono uppercase tracking-widest px-3.5 py-2 cyber-clip-button transition-all duration-300 cursor-pointer border border-transparent",
                                            isParentActive
                                                ? "bg-primary/15 text-primary border-primary/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] font-bold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-primary/5 hover:border-primary/20"
                                        )}
                                    >
                                        <span className="opacity-40 text-[10px] mr-1.5 font-normal">{itemIndex}.</span>
                                        <span>{getItemLabel(item.name)}</span>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[380px] gap-2 p-4 md:w-[480px] md:grid-cols-2 relative">
                                            <div className="cyber-tag-header !right-4">
                                                // SYS_MODULES
                                            </div>
                                            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-40" />
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
                                            "inline-flex items-center justify-center text-xs font-mono uppercase tracking-widest px-3.5 py-2 cyber-clip-button transition-all duration-300 cursor-pointer border border-transparent",
                                            isParentActive
                                                ? "bg-primary/15 text-primary border-primary/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] font-bold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-primary/5 hover:border-primary/20"
                                        )}
                                    >
                                        <span className="opacity-40 text-[10px] mr-1.5 font-normal">{itemIndex}.</span>
                                        <span>{getItemLabel(item.name)}</span>
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
                        "block select-none space-y-1 cyber-clip-button p-3 leading-none no-underline outline-none transition-all duration-200 border border-primary/15 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground group cursor-pointer",
                        active && "bg-primary/20 border-primary/60 text-primary shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]",
                        className
                    )}
                    {...props}
                >
                    <div className="text-xs font-mono uppercase tracking-wider text-foreground group-hover:text-primary transition-colors flex items-center justify-between font-bold">
                        <span>{title}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity text-xs">▶</span>
                    </div>
                    {children && (
                        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground mt-1.5 font-sans">
                            {children}
                        </p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
