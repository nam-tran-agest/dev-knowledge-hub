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
        <div className="border-b border-primary/20 bg-[#04060f]/90 backdrop-blur-2xl sticky top-16 z-10 px-4 md:px-8 py-4 cyber-scanline">
            {/* Top Wire */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-primary/70 hover:text-primary cyber-clip-button border border-primary/20 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                    </Button>

                    <div className="flex items-center gap-3.5">
                        <div
                            className="p-2.5 cyber-clip-button bg-primary/10 border border-primary/40 shadow-inner"
                            style={{ color: project.color || '#00f0ff', borderColor: project.color }}
                        >
                            <IconComponent size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider">
                                    {project.name}
                                </h1>
                                <span className="text-[9px] font-mono text-primary/60 px-1.5 py-0.5 border border-primary/30 cyber-clip-tag uppercase">
                                    // {project.status}
                                </span>
                            </div>
                            <p className="text-xs text-primary/60 font-mono line-clamp-1">
                                {project.description || '// ACTIVE_WORKSPACE_TELEMETRY'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-primary/10 border-primary/40 text-primary hover:bg-primary/20 cyber-clip-button px-4 cursor-pointer font-mono text-xs uppercase tracking-wider"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <SettingsIcon size={13} className="mr-1.5" />
                        [ CONFIG ]
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
