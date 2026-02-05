'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import type { Category, Tag } from '@/types'

interface FilterBarProps {
    categories: Category[]
    tags: Tag[]
    selectedCategory?: string
    selectedTag?: string
    searchQuery?: string
}

import { useTranslations } from 'next-intl'

export function FilterBar({
    categories,
    tags,
    selectedCategory,
    selectedTag,
    searchQuery,
}: FilterBarProps) {
    const t = useTranslations('notes.filter')
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateParams = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.delete('page') // Reset pagination on filter change
        router.push(`/notes?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/notes')
    }

    const hasFilters = selectedCategory || selectedTag || searchQuery

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t('search')}
                    defaultValue={searchQuery}
                    onChange={(e) => {
                        const value = e.target.value
                        if (value.length >= 2 || value.length === 0) {
                            updateParams('search', value || null)
                        }
                    }}
                    className="pl-9"
                />
            </div>

            {/* Category Filter */}
            <Select
                value={selectedCategory || 'all'}
                onValueChange={(value) => updateParams('category', value === 'all' ? null : value)}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('allCategories')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('allCategories')}</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color || '#888' }}
                                />
                                {category.name || category.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select
                value={selectedTag || 'all'}
                onValueChange={(value) => updateParams('tag', value === 'all' ? null : value)}
            >
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('allTags')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{t('allTags')}</SelectItem>
                    {tags.map((tag) => (
                        <SelectItem key={tag.id} value={String(tag.id)}>
                            {tag.name || tag.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
