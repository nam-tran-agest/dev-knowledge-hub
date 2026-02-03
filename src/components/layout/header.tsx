import { SearchModal } from '@/components/search'
import { CC_STYLES } from '@/lib/constants'
import { MainNav } from './main-nav'

export function Header() {
    return (
        <header className={`sticky top-0 z-30 flex h-16 items-center border-b border-white/5 bg-background/50 px-6 backdrop-blur-xl ${CC_STYLES.header}`}>
            <div className="flex h-16 items-center gap-3 mr-8">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">DK</span>
                </div>
                <span className="font-semibold text-white hidden md:block">DevKnowledge</span>
            </div>

            <MainNav />

            <div className="flex-1" />
            <SearchModal />
        </header>
    )
}
