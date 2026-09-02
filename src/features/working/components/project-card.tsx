import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Project } from '@/features/working/types'
import { PROJECT_ICON_MAP, DEFAULT_PROJECT_ICON, Pin, SettingsIcon } from './icon-map'
import { motion } from 'motion/react'
import { Link, useRouter } from '@/i18n/routing'
import { MoreVertical, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteProject } from '@/features/working/services/projects'
import { EditProjectModal } from './edit-project-modal'

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const IconComponent = PROJECT_ICON_MAP[project.icon || 'Layout'] || DEFAULT_PROJECT_ICON

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDeleting(true)
        try {
            await deleteProject(project.id)
            setShowDeleteConfirm(false)
            router.refresh()
        } catch (err) {
            console.error('Failed to delete project:', err)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
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
                        <div className="absolute top-3 right-14 px-2.5 py-0.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-[9px] uppercase tracking-widest text-primary font-mono font-bold">
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

                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                {project.is_pinned && (
                                    <Pin size={16} className="text-amber-400 fill-amber-400" />
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            className="h-7 w-7 text-primary/60 hover:text-white hover:bg-primary/20 cyber-clip-button border border-primary/20 cursor-pointer"
                                            title="Tùy chọn dự án"
                                        >
                                            <MoreVertical size={13} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44 font-mono">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setIsEditOpen(true)
                                            }}
                                            className="gap-2 cursor-pointer text-xs uppercase"
                                        >
                                            <SettingsIcon size={12} className="text-primary" /> [ CẤU HÌNH ]
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setShowDeleteConfirm(true)
                                            }}
                                            className="gap-2 text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer text-xs uppercase"
                                        >
                                            <Trash2 size={12} /> [ XOÁ DỰ ÁN ]
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
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

        <EditProjectModal
            project={project}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
        />

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent className="border-destructive/40 text-white shadow-[0_0_50px_rgba(255,0,60,0.3)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-mono font-bold uppercase tracking-wider text-destructive">
                        // WARNING: IRREVERSIBLE_PURGE
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-primary/70 text-xs font-mono">
                        Xác nhận xoá vĩnh viễn dự án <span className="text-white font-bold">{project.name}</span> cùng toàn bộ các công việc liên quan? Thao tác này không thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel 
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowDeleteConfirm(false)
                        }}
                        className="bg-transparent border border-primary/30 text-primary hover:bg-primary/10 cyber-clip-button font-mono text-xs uppercase cursor-pointer"
                    >
                        [ HUỶ BỎ ]
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-white cyber-clip-button font-mono text-xs uppercase font-bold cursor-pointer shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ĐANG XOÁ...
                            </>
                        ) : (
                            '[ XÁC NHẬN XOÁ ]'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
    )
}
