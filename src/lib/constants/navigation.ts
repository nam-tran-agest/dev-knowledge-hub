import {
    Settings,
    type LucideIcon
} from 'lucide-react'

// Navigation items used in Sidebar and MobileNav
export interface NavItem {
    name: string
    href: string
    icon?: LucideIcon
    items?: { name: string; href: string }[]
}

export const MAIN_NAVIGATION: NavItem[] = [
    {
        name: 'Working',
        href: '/working',
    },
    {
        name: 'Media',
        href: '/media',
        items: [
            { name: 'YouTube', href: '/media/youtube' },
            { name: 'News', href: '/media/news' },
            { name: 'Music', href: '/media/music' },
        ]
    },
    {
        name: 'Planner',
        href: '/planner',
        items: [
            { name: 'Today', href: '/planner/today' },
            { name: 'Week', href: '/planner/week' },
            { name: 'Someday', href: '/planner/someday' },
        ]
    },
    {
        name: 'MH Wilds',
        href: '/mh-wilds',
    },
]

export const FOOTER_NAVIGATION: NavItem[] = [
    { name: 'Settings', href: '/settings', icon: Settings },
]


