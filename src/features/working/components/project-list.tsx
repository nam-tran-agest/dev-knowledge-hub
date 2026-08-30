'use client'

import React, { useState } from 'react'
import { Project } from '@/features/working/types'
import { ProjectCard } from './project-card'
import { CreateProjectModal } from './create-project-modal'
import { CreateTaskModal } from './create-task-modal'
import { Button } from '@/components/ui/button'
import { CheckSquare } from 'lucide-react'
import { useRouter } from '@/i18n/routing'

interface ProjectListProps {
    projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
    const router = useRouter()

    return (
        <div className="space-y-6">
            {/* Quick Action Toolbar if projects exist */}
            {projects.length > 0 && (
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/40 cyber-clip-button font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] py-2 px-4"
                    >
                        <CheckSquare className="w-4 h-4 text-primary" />
                        <span>[ + ALLOCATE NEW TASK ]</span>
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create Project Button */}
                <CreateProjectModal />

                {/* Project Cards */}
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                    />
                ))}
            </div>

            {/* Quick Task Modal */}
            <CreateTaskModal
                projects={projects}
                open={isCreateTaskOpen}
                onOpenChange={setIsCreateTaskOpen}
                onSuccess={(newTask) => {
                    router.push(`/working/${newTask.project_id}`)
                }}
            />
        </div>
    )
}
