'use server'

import { createClient } from '@/lib/supabase/server'
import type { SearchResult } from '@/types'

export async function globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []

    const supabase = await createClient()
    const searchQuery = query.split(' ').join(' & ')

    // Search across all tables in parallel
    const [notesResult, snippetsResult, tasksResult, bugsResult] = await Promise.all([
        supabase
            .from('notes')
            .select('id, title, content, created_at')
            .textSearch('search_vector', searchQuery)
            .limit(5),

        supabase
            .from('snippets')
            .select('id, title, description, language, type, created_at')
            .textSearch('search_vector', searchQuery)
            .limit(5),

        supabase
            .from('tasks')
            .select('id, title, description, status, created_at')
            .ilike('title', `%${query}%`)
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
            subtitle: note.content?.slice(0, 100) || '',
            url: `/notes/${note.id}`,
            createdAt: note.created_at
        })
    })

    // Map snippets
    snippetsResult.data?.forEach(snippet => {
        results.push({
            id: snippet.id,
            type: snippet.type === 'prompt' ? 'prompt' : 'snippet',
            title: snippet.title,
            subtitle: snippet.description || `${snippet.language} ${snippet.type}`,
            url: `/snippets/${snippet.id}`,
            createdAt: snippet.created_at
        })
    })

    // Map tasks
    tasksResult.data?.forEach(task => {
        results.push({
            id: task.id,
            type: 'task',
            title: task.title,
            subtitle: `Status: ${task.status}`,
            url: `/tasks?highlight=${task.id}`,
            createdAt: task.created_at
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
