import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/actions/projects';
import { getTasks } from '@/lib/actions/tasks';
import { ProjectWorkspace } from '@/components/working/project-workspace';

export default async function ProjectPage({
    params
}: {
    params: Promise<{ locale: string; projectId: string }>;
}) {
    const { locale, projectId } = await params;

    const project = await getProjectById(projectId);
    if (!project) {
        notFound();
    }

    const tasks = await getTasks(projectId);

    return (
        <ProjectWorkspace
            project={project}
            initialTasks={tasks}
            locale={locale}
        />
    );
}
