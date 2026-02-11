import { notFound } from 'next/navigation';
import { getProjectById } from '@/features/working/services/projects';
import { getTasks } from '@/features/working/services/tasks';
import { ProjectWorkspace } from '@/features/working/components/project-workspace';
import { PageShell } from '@/components/layout/page-shell';

interface ProjectDetailContainerProps {
    projectId: string;
    locale: string;
}

export async function ProjectDetailContainer({ projectId, locale }: ProjectDetailContainerProps) {
    const project = await getProjectById(projectId);

    if (!project) {
        notFound();
    }

    const tasks = await getTasks(projectId);

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
