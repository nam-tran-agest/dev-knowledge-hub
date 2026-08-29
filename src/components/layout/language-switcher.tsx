'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const toggleLocale = () => {
        const nextLocale = locale === 'en' ? 'vi' : 'en'
        router.replace(pathname, { locale: nextLocale })
    }

    return (
        <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-3 py-1.5 cyber-clip-button bg-primary/10 hover:bg-primary/25 border border-primary/40 hover:border-primary text-xs font-mono text-primary transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] relative group"
            title={locale === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
        >
            <span className="text-[9px] text-primary/60 font-bold">[</span>
            <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-45 transition-transform" />
            <span className="uppercase font-bold tracking-wider">{locale}</span>
            <span className="text-[9px] text-primary/60 font-bold">]</span>
        </button>
    )
}
