import { ProjectDetailContainer } from '@/features/working/components/project-detail-container';

export default async function ProjectPage({
    params
}: {
    params: Promise<{ locale: string; projectId: string }>;
}) {
    const { locale, projectId } = await params;

    return <ProjectDetailContainer projectId={projectId} locale={locale} />;
}
