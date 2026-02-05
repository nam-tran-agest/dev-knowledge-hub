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
    navigationMenuTriggerStyle,
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
        // Try finding specific translation, fallback to name
        return t.has(`navigation.items.${parentKey}.items.${childKey}`)
            ? t(`navigation.items.${parentKey}.items.${childKey}`)
            : name
    }

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-2">
                {MAIN_NAVIGATION.map((item) => (
                    <NavigationMenuItem key={item.href}>
                        {item.items ? (
                            <>
                                <NavigationMenuTrigger className="bg-transparent">
                                    {getItemLabel(item.name)}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                                        navigationMenuTriggerStyle(),
                                        (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) && "bg-accent/50 text-accent-foreground"
                                    )}
                                >
                                    {getItemLabel(item.name)}
                                </Link>
                            </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                ))}

                {/* Settings */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/settings" className={navigationMenuTriggerStyle()}>
                            {t('navigation.settings')}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        active && "bg-accent/50 text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    {children && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                            {children}
                        </p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
