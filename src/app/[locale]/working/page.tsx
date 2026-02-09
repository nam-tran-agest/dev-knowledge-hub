import { getTranslations } from 'next-intl/server';
import { ProjectList } from '@/components/working/project-list';
import { getProjects } from '@/lib/actions/projects';

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
        <div className="min-h-screen pt-24 bg-[#0a0a0c] text-slate-200 overflow-x-hidden">
            <div className="px-4 md:px-8 py-8 md:py-12 max-w-7xl mx-auto space-y-12">
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
        </div>
    );
}
