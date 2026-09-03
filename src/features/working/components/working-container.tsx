'use client';

import React, { useEffect, useState } from 'react';
import { ProjectList } from '@/features/working/components/project-list';
import { getProjects } from '@/features/working/services/projects';
import { Project } from '@/features/working/types';
import { Terminal, Activity, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WorkingContainerProps {
    locale: string;
}

// In-memory client cache for instant navigation back and forth
let cachedProjects: Project[] | null = null;

export function invalidateProjectsCache() {
    cachedProjects = null;
}

export function WorkingContainer({ locale: _locale }: WorkingContainerProps) {
    const t = useTranslations('working');
    const [projects, setProjects] = useState<Project[]>(() => cachedProjects || []);
    const [isLoading, setIsLoading] = useState(() => !cachedProjects);

    useEffect(() => {
        let isMounted = true;

        async function loadProjects() {
            try {
                if (!cachedProjects) {
                    setIsLoading(true);
                }
                const data = await getProjects();
                if (!isMounted) return;
                const result = data || [];
                cachedProjects = result;
                setProjects(result);
            } catch (err) {
                console.error('Failed to load projects:', err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="py-8 md:py-12 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Telemetry Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/20 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary/70">// SYSTEM_WORKSPACE_COMMAND</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-mono font-extrabold uppercase tracking-wider text-white">
                        {t('title')}
                    </h1>
                    <p className="text-xs sm:text-sm font-mono text-primary/60 max-w-2xl uppercase tracking-wide">
                        // {t('description')}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/30 px-3.5 py-2 cyber-clip-button flex items-center gap-2 font-mono text-xs text-primary">
                        <Activity className="w-3.5 h-3.5 text-primary" />
                        <span>ACTIVE_PROJECTS: [ {isLoading ? '...' : projects.length} ]</span>
                    </div>
                </div>
            </div>

            {/* Content Area with Cyberpunk Skeleton */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider animate-pulse pb-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span>// SCANNING_NEURAL_REPOSITORIES...</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="h-52 p-6 bg-surface-deep/40 border border-primary/15 cyber-clip-button animate-pulse flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 cyber-clip-button" />
                                        <div className="w-3/4 h-5 bg-primary/10 border border-primary/20" />
                                        <div className="w-full h-3 bg-primary/5 border border-primary/10" />
                                    </div>
                                    <div className="w-1/2 h-3 bg-primary/10" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <ProjectList projects={projects} />
                )}
            </div>
        </div>
    );
}
