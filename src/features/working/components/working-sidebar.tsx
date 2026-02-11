'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutGrid, Pin, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Project } from '@/features/working/types'
import { getProjects } from '@/features/working/services/projects'

export function WorkingSidebar() {
    const params = useParams()
    const projectId = params.projectId as string
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await getProjects()
            setProjects(data)
        }
        fetchProjects()
    }, [])

    return (
        <aside className="w-full lg:w-64 min-w-0 bg-[#0a0a0c]/50 backdrop-blur-xl border-b lg:border-r border-white/5 flex flex-col shrink-0 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16">
            <ScrollArea className="flex-1">
                <div className="p-4 lg:p-6 space-y-8">
                    {/* Main Navigation */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center justify-between">
                            Navigation
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/working"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                                    !projectId
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                                )}
                            >
                                <LayoutGrid size={18} />
                                <span className="text-sm font-bold">Projects Library</span>
                            </Link>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center justify-between">
                            Recent Projects
                            <Link href="/working" className="hover:text-white transition-colors">
                                <Plus size={14} />
                            </Link>
                        </h3>
                        <div className="space-y-1">
                            {projects.map((project) => {
                                const isActive = projectId === project.id
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/working/${project.id}`}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                                            isActive
                                                ? "bg-white/5 text-white border border-white/10"
                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                                        )}
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{ backgroundColor: project.color }}
                                        />
                                        <span className="text-sm font-medium truncate flex-1">
                                            {project.name}
                                        </span>
                                        {project.is_pinned && (
                                            <Pin size={12} className="text-slate-600 fill-slate-600" />
                                        )}
                                    </Link>
                                )
                            })}

                            {projects.length === 0 && (
                                <p className="px-3 py-2 text-xs text-slate-600 italic">
                                    No projects created yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    )
}
