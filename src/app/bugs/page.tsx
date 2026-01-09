import Link from 'next/link'
import { getBugs } from '@/lib/actions/bugs'
import { BugCard } from '@/components/bugs'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, Bug } from 'lucide-react'

interface BugsPageProps {
    searchParams: Promise<{
        resolved?: string
    }>
}

export default async function BugsPage({ searchParams }: BugsPageProps) {
    const params = await searchParams
    const [{ data: openBugs }, { data: resolvedBugs }] = await Promise.all([
        getBugs({ resolved: false, limit: 50 }),
        getBugs({ resolved: true, limit: 50 }),
    ])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bug Log</h1>
                    <p className="text-muted-foreground mt-1">
                        Track issues and their solutions
                    </p>
                </div>
                <Button asChild>
                    <Link href="/bugs/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Log Bug
                    </Link>
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={params.resolved === 'true' ? 'resolved' : 'open'}>
                <TabsList>
                    <TabsTrigger value="open">
                        Open ({openBugs.length})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                        Resolved ({resolvedBugs.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="open" className="mt-6">
                    {openBugs.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {openBugs.map((bug) => (
                                <BugCard key={bug.id} bug={bug} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Bug}
                            title="No open bugs"
                            description="Great job! No bugs to fix right now"
                            action={
                                <Button asChild variant="outline">
                                    <Link href="/bugs/new">Log a new bug</Link>
                                </Button>
                            }
                        />
                    )}
                </TabsContent>

                <TabsContent value="resolved" className="mt-6">
                    {resolvedBugs.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {resolvedBugs.map((bug) => (
                                <BugCard key={bug.id} bug={bug} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Bug}
                            title="No resolved bugs yet"
                            description="Resolved bugs will appear here"
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
