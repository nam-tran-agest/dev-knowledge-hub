'use client';

import React, { useEffect, useState } from 'react';
import { getProjectById } from '@/features/working/services/projects';
import { getTasks } from '@/features/working/services/tasks';
import { ProjectWorkspace } from '@/features/working/components/project-workspace';
import { PageShell } from '@/components/layout/page-shell';
import { Project, Task } from '@/features/working/types';
import { Link } from '@/i18n/routing';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectDetailContainerProps {
    projectId: string;
    locale: string;
}

interface WorkspaceCacheEntry {
    project: Project;
    tasks: Task[];
    timestamp: number;
}

// Client-side SWR cache for instant workspace transitions
const clientWorkspaceCache = new Map<string, WorkspaceCacheEntry>();
const WORKSPACE_CACHE_TTL = 30 * 1000; // 30s TTL

export function ProjectDetailContainer({ projectId, locale }: ProjectDetailContainerProps) {
    const [project, setProject] = useState<Project | null>(() => {
        return clientWorkspaceCache.get(projectId)?.project || null;
    });
    const [tasks, setTasks] = useState<Task[]>(() => {
        return clientWorkspaceCache.get(projectId)?.tasks || [];
    });
    const [isLoading, setIsLoading] = useState(() => {
        const cached = clientWorkspaceCache.get(projectId);
        return !cached;
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadWorkspaceData() {
            // Check SWR cache: if available, display immediately
            const cached = clientWorkspaceCache.get(projectId);
            if (cached && isMounted) {
                setProject(cached.project);
                setTasks(cached.tasks);
                setIsLoading(false);
                // If cache is fresh, skip background refetch
                if ((Date.now() - cached.timestamp) < WORKSPACE_CACHE_TTL) {
                    return;
                }
            }

            try {
                if (!cached) {
                    setIsLoading(true);
                }
                setError(null);

                const proj = await getProjectById(projectId);
                if (!isMounted) return;

                if (!proj) {
                    setError('PROJECT_NOT_FOUND');
                    setIsLoading(false);
                    return;
                }

                setProject(proj);

                const taskList = await getTasks(proj.id);
                if (!isMounted) return;

                const finalTasks = taskList || [];
                setTasks(finalTasks);

                // Update SWR cache under all aliases (raw id, proj.id, slug)
                const cacheEntry = { project: proj, tasks: finalTasks, timestamp: Date.now() };
                clientWorkspaceCache.set(projectId, cacheEntry);
                clientWorkspaceCache.set(proj.id, cacheEntry);
                if (proj.slug) {
                    clientWorkspaceCache.set(proj.slug, cacheEntry);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    const msg = err instanceof Error ? err.message : 'FAILED_TO_LOAD_WORKSPACE';
                    console.error('Failed to load project workspace:', err);
                    setError(msg);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadWorkspaceData();

        return () => {
            isMounted = false;
        };
    }, [projectId]);

    // Loading Skeleton State (Rendered in < 1ms CPU time on Cloudflare Workers edge)
    if (isLoading) {
        return (
            <PageShell variant="landing" className="bg-[#0a0a0c]">
                <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6 mb-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary text-xs tracking-widest uppercase animate-pulse">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span>// ACCESSING_NEURAL_WORKSPACE [ {projectId} ] ...</span>
                            </div>
                            <div className="h-8 w-64 bg-primary/10 border border-primary/20 cyber-clip animate-pulse" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-9 w-24 bg-primary/10 border border-primary/20 cyber-clip animate-pulse" />
                            <div className="h-9 w-24 bg-primary/10 border border-primary/20 cyber-clip animate-pulse" />
                        </div>
                    </div>

                    {/* 5-Column Skeleton Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((col) => (
                            <div key={col} className="p-3 bg-surface-deep/40 border border-primary/15 cyber-clip min-h-[400px] flex flex-col gap-3">
                                <div className="h-6 w-full bg-primary/10 border border-primary/20 cyber-clip-tag animate-pulse" />
                                <div className="h-24 w-full bg-primary/5 border border-primary/10 cyber-clip animate-pulse" />
                                <div className="h-20 w-full bg-primary/5 border border-primary/10 cyber-clip animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </PageShell>
        );
    }

    // Error / Not Found State
    if (error || !project) {
        return (
            <PageShell variant="landing" className="bg-[#0a0a0c]">
                <div className="min-h-[70vh] flex items-center justify-center p-4 font-mono">
                    <div className="max-w-md w-full p-6 bg-surface-deep/80 border border-destructive/40 cyber-clip relative text-center space-y-5">
                        <div className="w-12 h-12 mx-auto bg-destructive/10 border border-destructive/30 cyber-clip-button flex items-center justify-center text-destructive">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-base font-bold uppercase tracking-wider text-white">
                                [ PROJECT_NOT_FOUND ]
                            </h2>
                            <p className="text-xs text-primary/60 uppercase">
                                Không tìm thấy dự án với định danh: &ldquo;{projectId}&rdquo;.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link href="/working">
                                <Button className="w-full bg-primary text-black font-mono font-bold uppercase tracking-wider cyber-clip-button hover:bg-primary/90 cursor-pointer">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    [ VỀ DANH SÁCH DỰ ÁN ]
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell variant="landing" className="bg-[#0a0a0c]">
            <ProjectWorkspace
                project={project}
                initialTasks={tasks}
                locale={locale}
            />
        </PageShell>
    );
}
