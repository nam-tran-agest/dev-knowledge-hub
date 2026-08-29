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
            <Link href={`/working/${project.id}`} className="block h-full">
                <Card className="h-full p-6 bg-card/60 border-primary/30 hover:border-primary hover:bg-card/80 transition-all duration-300 cursor-pointer group relative overflow-hidden backdrop-blur-xl hover:shadow-[0_0_25px_var(--color-primary)]">
                    {/* FUI Accent Corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ borderColor: project.color }} />
                    <div className="absolute top-3 right-6 px-2.5 py-0.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-[9px] uppercase tracking-widest text-primary font-mono font-bold">
                        // PROJ_{project.id.slice(0,4)}
                    </div>
                    
                    {/* Accent Glow */}
                    <div
                        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                        style={{ backgroundColor: project.color }}
                    />

                    <div className="relative z-10 flex items-start justify-between mb-4">
                        <div
                            className="p-3 cyber-clip-button bg-background border border-primary/20 text-white shadow-inner"
                            style={{ color: project.color, borderColor: project.color }}
                        >
                            <IconComponent size={22} />
                        </div>
                        {project.is_pinned && (
                            <Pin size={16} className="text-amber-400 fill-amber-400" />
                        )}
                    </div>

                    <div className="relative z-10 space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1 uppercase font-mono tracking-wider">
                            {project.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-mono line-clamp-2 min-h-[40px] leading-relaxed">
                            {project.description || '// AWAITING_SYSTEM_DATA...'}
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-primary/20 flex items-center justify-between text-[10px] text-primary/70 font-mono uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5"
                                style={{ backgroundColor: project.color }}
                            />
                            <span>{project.status}</span>
                        </div>
                        <span>UPDT: {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </Card>
            </Link>
        </motion.div>
    )
}
