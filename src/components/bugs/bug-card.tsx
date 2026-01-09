import Link from 'next/link'
import { formatRelative } from '@/lib/utils/date'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { Bug } from '@/types'
import { cn } from '@/lib/utils'
import { CC_STYLES } from '@/lib/constants'

interface BugCardProps {
    bug: Bug
}

export function BugCard({ bug }: BugCardProps) {
    return (
        <Link href={`/bugs/${bug.id}`}>
            <Card className={cn("h-full transition-all cursor-pointer group hover:border-red-500/30", CC_STYLES.card)}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2 text-gray-200 group-hover:text-red-400 transition-colors">
                            {bug.title}
                        </h3>
                        <Badge
                            variant={bug.resolved ? 'success' : 'destructive'}
                            className="gap-1.5 shrink-0 px-2.5 py-1"
                        >
                            {bug.resolved ? (
                                <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Resolved
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Open
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pb-2 space-y-3">
                    {bug.error_message ? (
                        <div className="bg-red-500/5 border border-red-500/10 rounded-md p-2.5">
                            <p className="text-xs font-mono text-red-300 line-clamp-2">
                                {bug.error_message}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No error message provided</p>
                    )}

                    {bug.solution && (
                        <div className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="line-clamp-2">{bug.solution}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="pt-2 flex items-center justify-between border-t border-white/5 mt-auto p-4">
                    <div className="flex flex-wrap gap-1">
                        {bug.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="text-[10px] h-5 border-white/10 text-gray-400">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">
                        {formatRelative(bug.created_at)}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
