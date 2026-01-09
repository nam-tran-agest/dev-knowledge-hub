import { getTasks } from '@/lib/actions/tasks'
import { TaskBoard } from '@/components/tasks'

export default async function TasksPage() {
    const tasks = await getTasks()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your personal tasks in a Kanban board
                </p>
            </div>

            {/* Task Board */}
            <TaskBoard initialTasks={tasks} />
        </div>
    )
}
