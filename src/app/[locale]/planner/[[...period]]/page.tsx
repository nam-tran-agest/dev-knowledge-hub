import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TodayView, WeekView, SomedayView } from '@/features/planner';

interface PlannerPageProps {
    params: Promise<{ locale: string; period?: string[] }>;
}

export async function generateMetadata({ params }: PlannerPageProps) {
    const { locale, period: periodParam } = await params;
    const period = periodParam?.[0] || 'today';
    const tNav = await getTranslations({ locale, namespace: 'navigation.items.planner' });

    const periodKey = ['today', 'week', 'someday'].includes(period) ? period : 'today';
    const periodTitle = tNav(`items.${periodKey}`);

    return {
        title: `${periodTitle} | Planner | Dev Knowledge Hub`,
        description: 'Cyberpunk neural task scheduling and high-impact execution planner.'
    };
}

export default async function PlannerPage({ params }: PlannerPageProps) {
    const { period: periodParam } = await params;
    const period = periodParam?.[0] || 'today';

    const validPeriods = ['today', 'week', 'someday'];
    if (!validPeriods.includes(period)) {
        notFound();
    }

    if (period === 'week') {
        return <WeekView />;
    }

    if (period === 'someday') {
        return <SomedayView />;
    }

    return <TodayView />;
}
