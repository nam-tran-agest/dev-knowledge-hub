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
        <aside className="w-full lg:w-64 min-w-0 bg-[#0a0e17]/60 backdrop-blur-xl border-b lg:border-r border-white/10 flex flex-col shrink-0 lg:h-[calc(100vh-64px)] lg:sticky lg:top-16">
            <ScrollArea className="flex-1">
                <div className="p-4 lg:p-6 space-y-7">
                    {/* Main Navigation */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 px-2 flex items-center justify-between">
                            Navigation
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/working"
                                className={cn(
                                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group font-semibold text-sm",
                                    !projectId
                                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                                )}
                            >
                                <LayoutGrid size={17} />
                                <span>Projects Library</span>
                            </Link>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 px-2 flex items-center justify-between">
                            Recent Projects
                            <Link href="/working" className="hover:text-white transition-colors p-1">
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
                                            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group text-sm font-medium",
                                            isActive
                                                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                                                : "text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent"
                                        )}
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                            style={{ backgroundColor: project.color }}
                                        />
                                        <span className="truncate flex-1">
                                            {project.name}
                                        </span>
                                        {project.is_pinned && (
                                            <Pin size={12} className="text-amber-400 fill-amber-400" />
                                        )}
                                    </Link>
                                )
                            })}

                            {projects.length === 0 && (
                                <p className="px-3 py-2 text-xs text-slate-500 italic">
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
