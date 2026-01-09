import Link from 'next/link'
import { FileText, Code, CheckSquare, Bug, TrendingUp, Clock, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    <Link href={href}>
      <Card className="hover:-translate-y-1 transition-transform duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{value}</div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
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
    getBugs({ resolved: false, limit: 1 })
  ])

  const activeTasks = tasksData.filter(task => task.status === 'doing').length

  const STATS_CARDS = [
    { title: 'Notes', icon: FileText, description: 'In your knowledge base', href: '/notes', color: ICON_COLORS.notes, value: notesData.count },
    { title: 'Snippets', icon: Code, description: 'Code & prompts saved', href: '/snippets', color: ICON_COLORS.snippets, value: snippetsData.count },
    { title: 'Active Tasks', icon: CheckSquare, description: 'In progress', href: '/tasks', color: ICON_COLORS.tasks, value: activeTasks },
    { title: 'Open Bugs', icon: Bug, description: 'Waiting for resolution', href: '/bugs', color: ICON_COLORS.bugs, value: bugsData.count },
  ]

  return (
    <div className={cn('space-y-6', ANIMATIONS.fadeIn)}>
      {/* Hero Banner - Adobe CC style */}
      <div className="cc-hero p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to DevKnowledge</h1>
          <p className="text-gray-300 text-sm max-w-md">
            Your personal knowledge hub for notes, code snippets, tasks, and bug tracking.
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-xs">⌘ K</kbd> to search everything.
          </p>
          <Button className="mt-4" size="sm" asChild>
            <Link href="/notes/new">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS_CARDS.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs mt-1 text-gray-600">Start by creating your first note</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <Button key={action.label} asChild variant={action.variant} size="sm" className="w-full justify-start">
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
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
          <CardTitle className="text-base">⌨️ Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {KEYBOARD_SHORTCUTS.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center gap-3">
                <kbd className="px-2.5 py-1 rounded-md bg-white/5 text-xs font-mono text-gray-400 border border-white/10">
                  {shortcut.key}
                </kbd>
                <span className="text-sm text-gray-500">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
