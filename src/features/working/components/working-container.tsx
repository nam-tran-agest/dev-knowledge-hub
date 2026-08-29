import { ProjectList } from '@/features/working/components/project-list';
import { getProjects } from '@/features/working/services/projects';
import { getTranslations } from 'next-intl/server';
import { Terminal, Activity } from 'lucide-react';

interface WorkingContainerProps {
    locale: string;
}

export async function WorkingContainer({ locale }: WorkingContainerProps) {
    const t = await getTranslations({ locale, namespace: 'working' });
    const projects = await getProjects();

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
                        <span>ACTIVE_PROJECTS: [ {projects.length} ]</span>
                    </div>
                </div>
            </div>

            <div className="min-h-[400px]">
                <ProjectList projects={projects} />
            </div>
        </div>
    );
}
