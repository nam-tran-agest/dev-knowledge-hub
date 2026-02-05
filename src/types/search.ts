export type SearchResultType = 'note' | 'bug'

export interface SearchResult {
    id: string
    type: SearchResultType
    title: string
    subtitle: string
    url: string
    createdAt: string
}
