import { Badge } from '@/components/ui/badge'
import { Tag } from '@/types'
import { cn } from '@/lib/utils'

interface NoteTagsProps {
    tags: Tag[] | undefined
    limit?: number
    className?: string
}

export function NoteTags({ tags, limit, className }: NoteTagsProps) {
    if (!tags || tags.length === 0) return null

    const displayTags = limit ? tags.slice(0, limit) : tags
    const remaining = limit ? Math.max(0, tags.length - limit) : 0

    return (
        <div className={cn("flex flex-wrap gap-1", className)}>
            {displayTags.map((tag) => (
                <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-[10px] h-5 bg-white/5 text-gray-400"
                >
                    #{tag.name}
                </Badge>
            ))}
            {remaining > 0 && (
                <span className="text-[10px] text-gray-500 flex items-center">
                    +{remaining}
                </span>
            )}
        </div>
    )
}
