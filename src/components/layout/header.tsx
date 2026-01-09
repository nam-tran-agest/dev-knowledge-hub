import { SearchModal } from '@/components/search'
import { CC_STYLES } from '@/lib/constants'

export function Header() {
    return (
        <header className={`sticky top-0 z-30 flex h-14 items-center justify-between px-6 ${CC_STYLES.header}`}>
            <div className="flex-1" />
            <SearchModal />
        </header>
    )
}
