import Link from 'next/link'
import { formatRelative } from '@/lib/utils/date'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from './copy-button'
import { Code, Terminal } from 'lucide-react'
import type { Snippet } from '@/types'
import { cn } from '@/lib/utils'
import { CC_STYLES } from '@/lib/constants'

interface SnippetCardProps {
    snippet: Snippet
}

export function SnippetCard({ snippet }: SnippetCardProps) {
    const Icon = snippet.type === 'code' ? Code : Terminal

    return (
        <Link href={`/snippets/${snippet.id}`} className="block h-full">
            <Card className={cn("h-full group hover:border-emerald-500/30 flex flex-col", CC_STYLES.card)}>
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-1.5 rounded-md",
                                snippet.type === 'code' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-lg line-clamp-1 text-gray-200 group-hover:text-emerald-400 transition-colors">
                                {snippet.title}
                            </h3>
                        </div>
                        {snippet.language && (
                            <Badge variant="outline" className="shrink-0 bg-white/5 border-white/10 text-gray-400 font-mono text-[10px]">
                                {snippet.language}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pb-2 flex-1">
                    <div className="relative group/code rounded-md overflow-hidden bg-[#0d1117] border border-white/5">
                        <pre className="text-xs text-gray-300 p-3 font-mono line-clamp-4 min-h-[5rem] opacity-80">
                            <code>{snippet.content}</code>
                        </pre>
                        <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                            <CopyButton text={snippet.content} className="h-7 w-7 bg-white/10 hover:bg-white/20 text-white" />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2 flex items-center justify-between border-t border-white/5 mt-auto p-4">
                    <div className="flex flex-wrap gap-1">
                        {snippet.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-[10px] h-5 bg-white/5 text-gray-400">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">
                        {formatRelative(snippet.created_at)}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
