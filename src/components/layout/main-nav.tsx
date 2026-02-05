'use client'

import { Link, usePathname } from '@/i18n/routing' // Localized navigation
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

export function MainNav() {
    const pathname = usePathname()
    const t = useTranslations()

    const sections = [
        {
            label: t('navigation.sections.knowledge'),
            items: MAIN_NAVIGATION.filter(item => ['Notes', 'Snippets'].includes(item.name)),
        },
        {
            label: t('navigation.sections.work'),
            items: MAIN_NAVIGATION.filter(item => ['Tasks', 'Bugs'].includes(item.name)),
        }
    ]

    const getItemLabel = (name: string) => {
        switch (name) {
            case 'Dashboard': return t('navigation.items.dashboard');
            case 'Notes': return t('navigation.items.notes.label');
            case 'Snippets': return t('navigation.items.snippets.label');
            case 'Tasks': return t('navigation.items.tasks.label');
            case 'Bugs': return t('navigation.items.bugs.label');
            default: return name;
        }
    }

    const getItemDescription = (name: string) => {
        switch (name) {
            case 'Notes': return t('navigation.items.notes.description');
            case 'Snippets': return t('navigation.items.snippets.description');
            case 'Tasks': return t('navigation.items.tasks.description');
            case 'Bugs': return t('navigation.items.bugs.description');
            default: return '';
        }
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* Groups */}
                {sections.map((section) => (
                    <NavigationMenuItem key={section.label}>
                        <NavigationMenuTrigger>{section.label}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {section.items.map((item) => (
                                    <ListItem
                                        key={item.href}
                                        title={getItemLabel(item.name)}
                                        href={item.href} // Link automatically prefixes locale
                                        icon={item.icon}
                                        active={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                                    >
                                        {getItemDescription(item.name)}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
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

import React from 'react'
import { LucideIcon } from 'lucide-react'

const ListItem = React.forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & { icon?: LucideIcon, active?: boolean }
>(({ className, title, children, icon: Icon, active, href, ...props }, ref) => {
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
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {Icon && <Icon className="h-4 w-4" />}
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
