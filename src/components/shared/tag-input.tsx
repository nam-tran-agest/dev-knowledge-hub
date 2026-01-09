'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types'

interface TagInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    availableTags?: Tag[]
    placeholder?: string
    className?: string
}

export function TagInput({
    value,
    onChange,
    availableTags = [],
    placeholder = 'Add tag...',
    className,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const filteredSuggestions = availableTags.filter(
        (tag) =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(tag.id)
    )

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault()
            // Check if it matches an existing tag
            const matchingTag = availableTags.find(
                (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
            )
            if (matchingTag && !value.includes(matchingTag.id)) {
                onChange([...value, matchingTag.id])
            }
            setInputValue('')
            setShowSuggestions(false)
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1))
        }
    }

    const addTag = (tagId: string) => {
        if (!value.includes(tagId)) {
            onChange([...value, tagId])
        }
        setInputValue('')
        setShowSuggestions(false)
    }

    const removeTag = (tagId: string) => {
        onChange(value.filter((id) => id !== tagId))
    }

    const getTagName = (tagId: string) => {
        return availableTags.find((t) => t.id === tagId)?.name || tagId
    }

    return (
        <div className={cn("relative", className)}>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-background min-h-[42px]">
                {value.map((tagId) => (
                    <Badge key={tagId} variant="secondary" className="gap-1">
                        {getTagName(tagId)}
                        <button
                            type="button"
                            onClick={() => removeTag(tagId)}
                            className="ml-1 hover:text-destructive"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] border-0 h-auto p-0 focus-visible:ring-0"
                />
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-auto">
                    {filteredSuggestions.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(tag.id)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
