'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="lg:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="fixed top-3 left-4 z-50 bg-black/20 backdrop-blur-sm text-gray-200"
            >
                <Menu className="h-5 w-5" />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={cn('fixed left-0 top-0 h-full w-72 z-50 p-4 animate-slide-in-left', CC_STYLES.sidebar)}>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-sm">DK</span>
                                </div>
                                <span className="font-semibold text-white">DevKnowledge</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
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
                                                onClick={() => setIsOpen(false)}
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
                        <div className="absolute bottom-4 left-4 right-4 border-t border-white/5 pt-4">
                            {FOOTER_NAVIGATION.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={CC_STYLES.sidebarItem}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))}
                            <form action="/api/auth/signout" method="POST">
                                <button
                                    type="submit"
                                    className={cn(CC_STYLES.sidebarItem, 'w-full text-left font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300')}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
