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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-primary/40 text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            title={locale === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
        >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="uppercase font-semibold">{locale}</span>
        </button>
    )
}

export default LanguageSwitcher;
