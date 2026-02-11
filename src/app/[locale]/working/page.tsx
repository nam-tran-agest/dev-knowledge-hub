import { getTranslations } from 'next-intl/server';
import { ProjectList } from '@/features/working/components/project-list';
import { getProjects } from '@/features/working/services/projects';
import { PageShell } from '@/components/layout/page-shell';

export default async function WorkingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'working' });

    // Fetch real projects from DB
    const projects = await getProjects();

    return (
        <PageShell className="bg-[#0a0a0c] text-slate-200">
            <div className="py-8 md:py-12 space-y-12">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
                        {t('description')}
                    </p>
                </div>

                <div className="min-h-[400px]">
                    <ProjectList projects={projects} />
                </div>
            </div>
        </PageShell>
    );
}
