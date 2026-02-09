import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function PlannerPage({
    params
}: {
    params: Promise<{ locale: string; period?: string[] }>;
}) {
    const { locale, period: periodParam } = await params;
    const period = periodParam?.[0] || 'today';

    const validPeriods = ['today', 'week', 'someday'];
    if (!validPeriods.includes(period)) {
        notFound();
    }

    const tNav = await getTranslations({ locale, namespace: 'navigation.items.planner' });

    return (
        <div className="min-h-screen pt-32 bg-[#050505] flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                    {tNav(`items.${period}`)}
                </h1>
                <p className="text-slate-500 text-lg">
                    This module is currently under development. Stay tuned for a premium planning experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-50 pointer-events-none">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
            </div>
        </div>
    );
}
