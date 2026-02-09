import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { WorkingSidebar } from '@/components/working/working-sidebar';
import { TaskList } from '@/components/working/task-list';
import { Task } from '@/types/working';

export default async function WorkingPage({
    params
}: {
    params: Promise<{ locale: string; status?: string[] }>;
}) {
    const { locale, status: statusParam } = await params;
    const status = statusParam?.[0] || 'all';

    // Validate status
    const validStatuses = ['all', 'active', 'paused', 'blocked'];
    if (!validStatuses.includes(status)) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'working' });
    const tNav = await getTranslations({ locale, namespace: 'navigation.items.working' });

    // Mock data for now
    const mockTasks: Task[] = [
        { id: '1', documentId: 'doc-1', title: 'Complete YouTube i18n', description: 'Finish the audit and implementation for YouTube module', status: 'active', priority: 'high', user_id: 'mock-user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', documentId: 'doc-2', title: 'Design Working page', description: 'Create a premium layout for the working section', status: 'active', priority: 'medium', user_id: 'mock-user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', documentId: 'doc-3', title: 'Spotify Integration API', description: 'Research Spotify Web API for playlist support', status: 'paused', priority: 'medium', user_id: 'mock-user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    const filteredTasks = status === 'all'
        ? mockTasks
        : mockTasks.filter(task => task.status === status);

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200 overflow-x-hidden">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] overflow-hidden">
                <WorkingSidebar />

                <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div className="px-4 md:px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            <div className="space-y-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                    {status === 'all' ? t('title') : tNav(`items.${status}`)}
                                </h1>
                                <p className="text-sm md:text-base text-slate-500">
                                    {t('description')}
                                </p>
                            </div>

                            <div className="min-h-[400px]">
                                <TaskList tasks={filteredTasks} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
