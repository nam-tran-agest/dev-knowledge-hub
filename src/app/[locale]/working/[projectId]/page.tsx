import { ProjectDetailContainer } from '@/features/working';
import { setRequestLocale } from 'next-intl/server';

export default async function ProjectPage({
    params
}: {
    params: Promise<{ locale: string; projectId: string }>;
}) {
    const { locale, projectId } = await params;
    setRequestLocale(locale);

    return <ProjectDetailContainer projectId={projectId} locale={locale} />;
}
