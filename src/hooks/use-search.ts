'use client'

import { useState, useCallback, useTransition } from 'react'
import { globalSearch } from '@/lib/actions/search'
import { useDebounce } from './use-debounce'
import type { SearchResult } from '@/types'

export function useSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isPending, startTransition] = useTransition()

    const debouncedQuery = useDebounce(query, 300)

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([])
            return
        }

        startTransition(async () => {
            try {
                const searchResults = await globalSearch(searchQuery)
                setResults(searchResults)
            } catch (error) {
                console.error('Search failed:', error)
                setResults([])
            }
        })
    }, [])

    const clearSearch = useCallback(() => {
        setQuery('')
        setResults([])
    }, [])

    return {
        query,
        setQuery,
        debouncedQuery,
        results,
        isSearching: isPending,
        search,
        clearSearch,
    }
}
