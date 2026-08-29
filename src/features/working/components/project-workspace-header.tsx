'use client'

import React from 'react'
import { Project } from '@/features/working/types'
import { PROJECT_ICON_MAP, DEFAULT_PROJECT_ICON, ArrowLeft, SettingsIcon } from './icon-map'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { EditProjectModal } from './edit-project-modal'

interface ProjectWorkspaceHeaderProps {
    project: Project
    locale: string
}

export function ProjectWorkspaceHeader({ project }: ProjectWorkspaceHeaderProps) {
    const router = useRouter()
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const IconComponent = PROJECT_ICON_MAP[project.icon || 'Layout'] || DEFAULT_PROJECT_ICON

    return (
        <div className="border-b border-white/10 bg-[#060a14]/80 backdrop-blur-2xl sticky top-16 z-10 px-4 md:px-8 py-4 glare-top">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-white rounded-xl cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </Button>

                    <div className="flex items-center gap-3.5">
                        <div
                            className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-md"
                            style={{ color: project.color || '#818cf8' }}
                        >
                            <IconComponent size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                {project.name}
                            </h1>
                            <p className="text-xs text-slate-400 font-mono line-clamp-1">
                                {project.description || 'Quickly manage your tasks in this workspace.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/[0.03] border-white/10 text-slate-300 hover:text-white rounded-full px-4 cursor-pointer"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <SettingsIcon size={14} className="mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <EditProjectModal
                project={project}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />
        </div>
    )
}
