import {
    Home,
    FileText,
    Code,
    CheckSquare,
    Bug,
    Settings,
    Sparkles,
    type LucideIcon
} from 'lucide-react'

// Navigation items used in Sidebar and MobileNav
export interface NavItem {
    name: string
    href: string
    icon: LucideIcon
}

export const MAIN_NAVIGATION: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Snippets', href: '/snippets', icon: Code },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Bugs', href: '/bugs', icon: Bug },
]

export const FOOTER_NAVIGATION: NavItem[] = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

// Search result type mappings
export type SearchResultTypeKey = 'note' | 'snippet' | 'prompt' | 'task' | 'bug'

export const SEARCH_TYPE_ICONS: Record<SearchResultTypeKey, LucideIcon> = {
    note: FileText,
    snippet: Code,
    prompt: Sparkles,
    task: CheckSquare,
    bug: Bug,
}

export const SEARCH_TYPE_COLORS: Record<SearchResultTypeKey, string> = {
    note: 'bg-blue-500/20 text-blue-600',
    snippet: 'bg-green-500/20 text-green-600',
    prompt: 'bg-purple-500/20 text-purple-600',
    task: 'bg-yellow-500/20 text-yellow-600',
    bug: 'bg-red-500/20 text-red-600',
}

// Stats card gradients used in Dashboard
export const STATS_GRADIENTS = {
    notes: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    snippets: 'bg-gradient-to-br from-green-500 to-emerald-500',
    tasks: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    bugs: 'bg-gradient-to-br from-red-500 to-pink-500',
} as const

// Task status columns for Kanban board
export const TASK_COLUMNS = [
    { id: 'todo' as const, title: 'To Do', color: 'bg-slate-500' },
    { id: 'doing' as const, title: 'In Progress', color: 'bg-blue-500' },
    { id: 'done' as const, title: 'Done', color: 'bg-green-500' },
]
