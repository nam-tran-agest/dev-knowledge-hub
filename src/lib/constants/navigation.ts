import {
    Home,
    FileText,
    Code,
    CheckSquare,
    Bug,
    Settings,
    Sparkles,
    Briefcase,
    Image,
    Calendar,
    Bookmark,
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
        items: [
            { name: 'Active', href: '/working/active' },
            { name: 'Paused', href: '/working/paused' },
            { name: 'Blocked', href: '/working/blocked' },
        ]
    },
    {
        name: 'Media',
        href: '/media',
        items: [
            { name: 'YouTube', href: '/media/youtube' },
            { name: 'Movies', href: '/media/movies' },
            { name: 'Series', href: '/media/series' },
            { name: 'Anime', href: '/media/anime' },
            { name: 'Games', href: '/media/games' },
            { name: 'Music', href: '/media/music' },
        ]
    },
    {
        name: 'Notes',
        href: '/notes',
        items: [
            { name: 'Work', href: '/notes/work' },
            { name: 'Learn', href: '/notes/learn' },
            { name: 'Ideas', href: '/notes/ideas' },
            { name: 'Life', href: '/notes/life' },
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
        name: 'Bookmarks',
        href: '/bookmarks',
        items: [
            { name: 'Work', href: '/bookmarks/work' },
            { name: 'Learn', href: '/bookmarks/learn' },
            { name: 'Inspire', href: '/bookmarks/inspire' },
            { name: 'Life', href: '/bookmarks/life' },
            { name: 'Fun', href: '/bookmarks/fun' },
        ]
    },
]

export const FOOTER_NAVIGATION: NavItem[] = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

// Search result type mappings
export type SearchResultTypeKey = 'note' | 'bug'

export const SEARCH_TYPE_ICONS: Record<SearchResultTypeKey, LucideIcon> = {
    note: FileText,
    bug: Bug,
}

export const SEARCH_TYPE_COLORS: Record<SearchResultTypeKey, string> = {
    note: 'bg-blue-500/20 text-blue-600',
    bug: 'bg-red-500/20 text-red-600',
}

// Stats card gradients used in Dashboard
export const STATS_GRADIENTS = {
    notes: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    bugs: 'bg-gradient-to-br from-red-500 to-pink-500',
} as const

