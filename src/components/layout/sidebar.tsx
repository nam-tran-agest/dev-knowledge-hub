'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAIN_NAVIGATION, FOOTER_NAVIGATION, CC_STYLES } from '@/lib/constants'

// Grouped sidebar sections for Adobe CC style
const SIDEBAR_SECTIONS = [
    {
        label: 'Main',
        items: MAIN_NAVIGATION.slice(0, 1), // Dashboard
    },
    {
        label: 'Knowledge',
        items: MAIN_NAVIGATION.slice(1, 3), // Notes, Snippets
    },
    {
        label: 'Work',
        items: MAIN_NAVIGATION.slice(3, 5), // Tasks, Bugs
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className={cn('fixed left-0 top-0 z-40 h-screen w-64', CC_STYLES.sidebar)}>
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-14 items-center gap-3 px-4 border-b border-white/5">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DK</span>
                    </div>
                    <span className="font-semibold text-white">DevKnowledge</span>
                </div>

                {/* Grouped Navigation */}
                <nav className="flex-1 py-2 overflow-y-auto">
                    {SIDEBAR_SECTIONS.map((section, idx) => (
                        <div key={section.label}>
                            {idx > 0 && (
                                <div className={CC_STYLES.sidebarSection}>{section.label}</div>
                            )}
                            {section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname.startsWith(item.href))
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            isActive ? CC_STYLES.sidebarItemActive : CC_STYLES.sidebarItem
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-white/5 py-2">
                    {FOOTER_NAVIGATION.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={CC_STYLES.sidebarItem}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                    <form action="/api/auth/signout" method="POST">
                        <button type="submit" className={cn(CC_STYLES.sidebarItem, 'w-full text-left')}>
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
