import Link from 'next/link'
import { FileText, Code, CheckSquare, Bug, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ICON_COLORS, ANIMATIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { getNotes } from '@/lib/actions/notes'
import { getSnippets } from '@/lib/actions/snippets'
import { getTasks } from '@/lib/actions/tasks'
import { getBugs } from '@/lib/actions/bugs'

// Quick actions
const QUICK_ACTIONS = [
  { label: 'Create New Note', href: '/notes/new', icon: FileText, variant: 'default' as const },
  { label: 'Save New Snippet', href: '/snippets/new', icon: Code, variant: 'outline' as const },
  { label: 'Manage Tasks', href: '/tasks', icon: CheckSquare, variant: 'outline' as const },
  { label: 'Log a Bug', href: '/bugs/new', icon: Bug, variant: 'outline' as const },
]

// Keyboard shortcuts
const KEYBOARD_SHORTCUTS = [
  { key: '⌘ K', description: 'Global Search' },
  { key: '⌘ N', description: 'New Item' },
  { key: 'Esc', description: 'Close Modal' },
]

// Stats card component
function StatsCard({ title, icon: Icon, description, href, color, value = 0 }: {
  title: string
  icon: React.ElementType
  description: string
  href: string
  color: string
  value?: number
}) {
  return (
    <Link href={href} className="block group">
      <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center bg-muted group-hover:bg-primary/10 transition-colors', color.replace('text-', 'text-opacity-100 text-'))}>
            <Icon className={cn("h-4 w-4", color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function Dashboard() {
  // Fetch stats in parallel
  const [notesData, snippetsData, tasksData, bugsData] = await Promise.all([
    getNotes({ limit: 1 }),
    getSnippets({ limit: 1 }),
    getTasks(),
    getBugs({ filters: { resolved: false }, limit: 1 })
  ])

  const activeTasks = tasksData.filter(task => task.status === 'doing').length

  const STATS_CARDS = [
    { title: 'Notes', icon: FileText, description: 'In your knowledge base', href: '/notes', color: ICON_COLORS.notes, value: notesData.count },
    { title: 'Snippets', icon: Code, description: 'Code & prompts saved', href: '/snippets', color: ICON_COLORS.snippets, value: snippetsData.count },
    { title: 'Active Tasks', icon: CheckSquare, description: 'In progress', href: '/tasks', color: ICON_COLORS.tasks, value: activeTasks },
    { title: 'Open Bugs', icon: Bug, description: 'Waiting for resolution', href: '/bugs', color: ICON_COLORS.bugs, value: bugsData.count },
  ]

  return (
    <div className={cn('space-y-8', ANIMATIONS.fadeIn)}>
      {/* Hero Banner - Replaced custom CSS with Tailwind/Shadcn */}
      <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-600/20 via-primary/10 to-purple-600/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <CardContent className="p-8 md:p-10 flex flex-col items-start gap-4 z-10 relative">
          <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
            v1.0.0 Beta
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome to DevKnowledge
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Your personal knowledge hub for notes, code snippets, tasks, and bug tracking.
              Designed for developers, by developers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25" asChild>
              <Link href="/notes/new">
                Create Note <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-background/30 backdrop-blur-sm border border-white/10 text-sm text-muted-foreground">
              Press <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">⌘ K</kbd> to search
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS_CARDS.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>What you've been working on lately</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl border-muted bg-muted/20">
              <Sparkles className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">No recent activity</p>
              <Button variant="link" className="mt-2 text-primary" asChild>
                <Link href="/notes/new">Start by creating a note</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                asChild
                variant="outline"
                className="w-full justify-start h-12 text-base hover:bg-muted/50 hover:border-primary/50 transition-all group"
              >
                <Link href={action.href}>
                  <div className={cn("mr-3 p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors", action.label.includes('Bug') ? 'text-red-500' : 'text-primary')}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <span className="text-xl">⌨️</span> Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {KEYBOARD_SHORTCUTS.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent hover:border-muted transition-colors">
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                <kbd className="inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-foreground opacity-100">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
