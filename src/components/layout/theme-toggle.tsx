'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('system')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return

        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            root.classList.add(systemTheme)
        } else {
            root.classList.add(theme)
        }

        localStorage.setItem('theme', theme)
    }, [theme, mounted])

    const cycleTheme = () => {
        setTheme((prev) => {
            if (prev === 'light') return 'dark'
            if (prev === 'dark') return 'system'
            return 'light'
        })
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3">
                <Monitor className="h-5 w-5" />
                <span>Theme</span>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="w-full justify-start gap-3"
        >
            {theme === 'light' && <Sun className="h-5 w-5" />}
            {theme === 'dark' && <Moon className="h-5 w-5" />}
            {theme === 'system' && <Monitor className="h-5 w-5" />}
            <span className="capitalize">{theme} mode</span>
        </Button>
    )
}
