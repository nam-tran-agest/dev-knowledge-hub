'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { globalSearch } from '@/lib/actions/search'
import { useDebounce, useKeyboardShortcut } from '@/hooks'
import { SEARCH_TYPE_ICONS, ICON_COLORS } from '@/lib/constants'
import { Search, Loader2, ArrowRight, Command, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchResult, SearchResultType } from '@/types'

export function SearchModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const debouncedQuery = useDebounce(query, 300)

    // Open modal with Cmd/Ctrl + K
    useKeyboardShortcut('k', () => setIsOpen(true), { metaKey: true })

    // Search when query changes
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const searchResults = await globalSearch(debouncedQuery)
                setResults(searchResults)
                setSelectedIndex(0)
            } catch (error) {
                console.error('Search failed:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        performSearch()
    }, [debouncedQuery])

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('')
            setResults([])
            setSelectedIndex(0)
        }
    }, [isOpen])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex((prev) => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                if (results[selectedIndex]) {
                    router.push(results[selectedIndex].url)
                    setIsOpen(false)
                }
                break
            case 'Escape':
                setIsOpen(false)
                break
        }
    }, [results, selectedIndex, router])

    const navigateToResult = (result: SearchResult) => {
        router.push(result.url)
        setIsOpen(false)
    }

    const getTypeIcon = (type: SearchResultType) => {
        return SEARCH_TYPE_ICONS[type] || Search
    }

    const getTypeColor = (type: SearchResultType) => {
        const colorKey = type as keyof typeof ICON_COLORS;
        return ICON_COLORS[colorKey] || 'bg-slate-500/20 text-slate-400'
    }

    return (
        <>
            {/* Search Trigger Button - Modern Input Style */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative flex items-center gap-3 px-3 md:px-4 py-2.5 w-full max-w-[280px] md:max-w-xs lg:max-w-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 shadow-sm"
            >
                <Search className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Search anything...</span>
                <span className="absolute right-3 flex items-center gap-1">
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-500 group-hover:text-slate-400">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </span>
            </button>

            {/* Search Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[95vw] max-w-2xl p-0 gap-0 overflow-hidden border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl rounded-xl ring-1 ring-white/10">
                    <DialogTitle className="sr-only">Search</DialogTitle>

                    {/* Search Input Area */}
                    <div className="flex items-center border-b border-white/10 px-4 py-3 bg-white/2">
                        <Search className="h-5 w-5 text-slate-400 shrink-0" />
                        <Input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What are you looking for?"
                            className="border-0 focus:ring-0 focus:shadow-none bg-transparent text-lg h-10 text-white placeholder-slate-500 rounded-none shadow-none px-4"
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-500 hover:text-white"
                                aria-label="Close search"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="max-h-[60vh] overflow-y-auto bg-transparent">
                        {results.length > 0 ? (
                            <div className="p-2 space-y-1">
                                {results.map((result, index) => {
                                    const Icon = getTypeIcon(result.type)
                                    const isSelected = index === selectedIndex

                                    return (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => navigateToResult(result)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "w-full flex items-center gap-4 px-4 py-3 text-left transition-all rounded-lg group",
                                                isSelected ? 'bg-blue-500/10' : 'hover:bg-white/5'
                                            )}
                                        >
                                            <div className={cn(
                                                'p-2.5 rounded-lg shrink-0 transition-transform duration-300',
                                                getTypeColor(result.type),
                                                isSelected ? 'scale-110 shadow-lg' : 'scale-100'
                                            )}>
                                                <Icon className="h-4 w-4 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className={cn(
                                                    "font-medium truncate transition-colors",
                                                    isSelected ? "text-blue-200" : "text-slate-200"
                                                )}>
                                                    {result.title}
                                                </div>
                                                <div className="text-sm flex items-center gap-2 mt-0.5">
                                                    <Badge variant="secondary" className="scale-90 origin-left uppercase tracking-wider text-[10px] bg-white/5 text-slate-400 border-white/5">
                                                        {result.type}
                                                    </Badge>
                                                    <span className="text-slate-500 truncate">{result.subtitle}</span>
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "transition-all duration-200 flex items-center",
                                                isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                                            )}>
                                                <ArrowRight className="h-4 w-4 text-blue-400" />
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        ) : query.length >= 2 && !isLoading ? (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                    <Search className="h-8 w-8 text-slate-500" />
                                </div>
                                <p className="text-lg font-medium text-slate-300">No matches found</p>
                                <p className="text-sm text-slate-500 mt-1">Try searching for something else</p>
                            </div>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="text-xs uppercase tracking-widest font-semibold text-slate-600 mb-6">Suggestions</p>
                                <div className="flex justify-center gap-3 flex-wrap max-w-lg mx-auto px-6">
                                    {[
                                        { label: 'Notes', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
                                        { label: 'Snippets', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
                                        { label: 'Tasks', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
                                        { label: 'Bugs', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
                                    ].map((item) => (
                                        <Badge
                                            key={item.label}
                                            className={cn("border px-4 py-2 cursor-pointer transition-all hover:scale-105", item.class)}
                                            onClick={() => setQuery(item.label.slice(0, -1))} // Just a demo action
                                        >
                                            {item.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/5 px-4 py-3 bg-white/2">
                        <div className="flex gap-4 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <kbd className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-slate-300">↑</kbd>
                                <kbd className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-slate-300">↓</kbd>
                                to navigate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="flex h-5 w-fit px-1.5 items-center justify-center rounded bg-white/10 text-slate-300">↵</kbd>
                                to select
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

