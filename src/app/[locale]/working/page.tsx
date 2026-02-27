import { PageShell } from '@/components/layout/page-shell';
import { WorkingContainer } from '@/features/working/components/working-container';
import { MatrixRain } from '@/components/ui/matrix-rain';

export default async function WorkingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <PageShell className="bg-[#0a0a0c] relative text-slate-200">
            <MatrixRain />
            <div className="relative z-10 mix-blend-lighten">
                <WorkingContainer locale={locale} />
            </div>
        </PageShell>
    );
}
