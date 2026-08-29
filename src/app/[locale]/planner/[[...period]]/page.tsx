import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TodayView } from '@/features/planner';
import { Terminal } from 'lucide-react';

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

    if (period === 'today') {
        return <TodayView />;
    }

    return (
        <div className="min-h-screen pt-32 bg-background flex flex-col items-center justify-center p-6 space-y-8 relative overflow-hidden font-mono">
            <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />

            <div className="text-center space-y-3 max-w-2xl relative z-10">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Terminal className="w-4 h-4 animate-pulse" />
                    <span className="text-xs uppercase tracking-widest">// MODULE_PROVISIONING</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider">
                    {tNav(`items.${period}`)}
                </h1>
                <p className="text-primary/60 text-xs sm:text-sm uppercase">
                    // Module is currently in development stage. Neural schedule matrix loading soon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-40 pointer-events-none relative z-10">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-36 cyber-clip bg-[#050714] border border-dashed border-primary/30 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[8px] text-primary/60">
                            // BUFFER_{i}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
