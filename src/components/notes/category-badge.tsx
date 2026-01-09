import { Badge } from '@/components/ui/badge'
import { Category } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
    category: Category
    className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    return (
        <Badge
            variant="outline"
            style={{
                backgroundColor: `${category.color}20`,
                borderColor: `${category.color}40`,
                color: category.color
            }}
            className={cn("shrink-0", className)}
        >
            {category.name}
        </Badge>
    )
}
