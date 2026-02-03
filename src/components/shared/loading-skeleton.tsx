import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
    count?: number
    className?: string
}

export function LoadingSkeleton({ count = 6, className }: LoadingSkeletonProps) {
    return (
        <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 animate-pulse">
                    <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-5 bg-muted rounded w-16" />
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                        <div className="h-4 bg-muted rounded w-4/6" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            <div className="h-5 bg-muted rounded w-12" />
                            <div className="h-5 bg-muted rounded w-14" />
                        </div>
                        <div className="h-4 bg-muted rounded w-20" />
                    </div>
                </div>
            ))}
        </div>
    )
}

interface LoadingSpinnerProps {
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
    text?: string
}

export function LoadingSpinner({ className, size = "default", text }: LoadingSpinnerProps) {
    const sizeClasses = {
        default: "h-8 w-8 border-4",
        sm: "h-4 w-4 border-2",
        lg: "h-12 w-12 border-4",
        icon: "h-6 w-6 border-2"
    }

    return (
        <div className={cn("flex flex-col items-center justify-center py-8 gap-4", className)}>
            <div className={cn("animate-spin rounded-full border-muted border-t-primary", sizeClasses[size])} />
            {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
        </div>
    )
}
