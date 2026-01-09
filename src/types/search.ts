export type SearchResultType = 'note' | 'snippet' | 'prompt' | 'task' | 'bug'

export interface SearchResult {
    id: string
    type: SearchResultType
    title: string
    subtitle: string
    url: string
    createdAt: string
}
