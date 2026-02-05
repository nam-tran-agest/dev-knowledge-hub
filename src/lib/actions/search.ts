'use server'

import { createClient } from '@/lib/supabase/server'
import type { SearchResult } from '@/types'

export async function globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const supabase = await createClient()
    const searchQuery = query.split(' ').join(' & ')

    // Search across remaining tables in parallel
    const [notesResult, bugsResult] = await Promise.all([
        supabase
            .from('kb_notes_unified')
            .select('id, title, content, updated_at')
            .textSearch('search_vector', searchQuery)
            .limit(5),

        supabase
            .from('bugs')
            .select('id, title, error_message, resolved, created_at')
            .textSearch('search_vector', searchQuery)
            .limit(5),
    ])

    const results: SearchResult[] = []

    // Map notes
    notesResult.data?.forEach(note => {
        results.push({
            id: note.id,
            type: 'note',
            title: note.title,
            subtitle: note.content?.slice(0, 100).replace(/<[^>]*>/g, '') || '',
            url: `/notes/${note.id}`,
            createdAt: note.updated_at
        })
    })

    // Map bugs
    bugsResult.data?.forEach(bug => {
        results.push({
            id: bug.id,
            type: 'bug',
            title: bug.title,
            subtitle: bug.resolved ? '✅ Resolved' : '🔴 Open',
            url: `/bugs/${bug.id}`,
            createdAt: bug.created_at
        })
    })

    // Sort by relevance (most recent first)
    return results.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}
