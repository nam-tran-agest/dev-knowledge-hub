'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Project } from '@/features/working/types'
import { PROJECT_ICON_MAP, DEFAULT_PROJECT_ICON, Pin } from './icon-map'
import { motion } from 'motion/react'
import { Link } from '@/i18n/routing'

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const IconComponent = PROJECT_ICON_MAP[project.icon || 'Layout'] || DEFAULT_PROJECT_ICON

    return (
        <motion.div
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/working/${project.id}`} className="block">
                <Card className="p-6 bg-white/[0.03] border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-3xl backdrop-blur-xl shadow-xl hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]">
                    {/* Accent Glow */}
                    <div
                        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ backgroundColor: project.color }}
                    />

                    <div className="flex items-start justify-between mb-4">
                        <div
                            className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white shadow-inner"
                            style={{ color: project.color }}
                        >
                            <IconComponent size={22} />
                        </div>
                        {project.is_pinned && (
                            <Pin size={16} className="text-amber-400 fill-amber-400" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {project.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px] leading-relaxed">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: project.color }}
                            />
                            <span className="capitalize">{project.status}</span>
                        </div>
                        <span>Updated {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
