'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { MAIN_NAVIGATION, NavItem } from '@/lib/constants'

// Grouping logic (similar to sidebar)
const SECTIONS = [
    {
        label: 'Knowledge',
        items: MAIN_NAVIGATION.filter(item => ['Notes', 'Snippets'].includes(item.name)),
    },
    {
        label: 'Work',
        items: MAIN_NAVIGATION.filter(item => ['Tasks', 'Bugs'].includes(item.name)),
    }
]
const DASHBOARD = MAIN_NAVIGATION.find(item => item.name === 'Dashboard')

export function MainNav() {
    const pathname = usePathname()

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* Dashboard Link */}
                {DASHBOARD && (
                    <NavigationMenuItem>
                        <Link href={DASHBOARD.href} legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                {DASHBOARD.name}
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                )}

                {/* Groups */}
                {SECTIONS.map((section) => (
                    <NavigationMenuItem key={section.label}>
                        <NavigationMenuTrigger>{section.label}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {section.items.map((item) => (
                                    <ListItem
                                        key={item.href}
                                        title={item.name}
                                        href={item.href}
                                        icon={item.icon}
                                        active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                                    >
                                        {item.name === 'Notes' && 'Manage your personal knowledge base.'}
                                        {item.name === 'Snippets' && 'Save and organize code snippets.'}
                                        {item.name === 'Tasks' && 'Track your todos and progress.'}
                                        {item.name === 'Bugs' && 'Log and resolve software issues.'}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}

                {/* Settings (Footer items moved to top) */}
                <NavigationMenuItem>
                    <Link href="/settings" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Settings
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

import React from 'react'
import { LucideIcon } from 'lucide-react'

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & { icon?: LucideIcon, active?: boolean }
>(({ className, title, children, icon: Icon, active, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        active && "bg-accent/50 text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {Icon && <Icon className="h-4 w-4" />}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
