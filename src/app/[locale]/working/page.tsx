import { PageShell } from '@/components/layout/page-shell';
import { WorkingContainer } from '@/features/working/components/working-container';

export default async function WorkingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <PageShell className="bg-[#0a0a0c] text-slate-200">
            <WorkingContainer locale={locale} />
        </PageShell>
    );
}
