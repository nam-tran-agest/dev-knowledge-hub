'use client'

import React from 'react'
import { Project } from '@/types/working'
import * as Icons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { EditProjectModal } from './edit-project-modal'

interface ProjectWorkspaceHeaderProps {
    project: Project
    locale: string
}

export function ProjectWorkspaceHeader({ project, locale }: ProjectWorkspaceHeaderProps) {
    const router = useRouter()
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const IconComponent = (Icons as any)[project.icon || 'Layout'] || Icons.Layout

    return (
        <div className="border-b border-[#1e1e24] bg-[#0a0a0c]/80 backdrop-blur-md sticky top-16 z-10 px-4 md:px-8 py-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="text-slate-400 hover:text-white"
                    >
                        <Icons.ArrowLeft size={20} />
                    </Button>

                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg bg-[#16161a]"
                            style={{ color: project.color }}
                        >
                            <IconComponent size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                {project.name}
                            </h1>
                            <p className="text-xs text-slate-500 line-clamp-1">
                                {project.description || 'Quickly manage your tasks in this workspace.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-auto md:ml-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#16161a] border-[#2a2a30] text-slate-400 hover:text-white"
                        onClick={() => setIsEditOpen(true)}
                    >
                        <Icons.Settings size={16} className="mr-2" />
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
