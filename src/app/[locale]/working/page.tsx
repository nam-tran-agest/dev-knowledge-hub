import { PageShell } from '@/components/layout/page-shell';
import { WorkingContainer } from '@/features/working';
import { MatrixRain } from '@/components/ui/matrix-rain';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function WorkingPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <PageShell className="bg-[#0a0a0c] relative text-slate-200">
            <MatrixRain />
            <div className="relative z-10">
                <WorkingContainer locale={locale} />
            </div>
        </PageShell>
    );
}
