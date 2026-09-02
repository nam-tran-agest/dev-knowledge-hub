import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TodayView, WeekView, SomedayView } from '@/features/planner';
import { routing } from '@/i18n/routing';

interface PlannerPageProps {
    params: Promise<{ locale: string; period?: string[] }>;
}

export function generateStaticParams() {
    const periods = [['today'], ['week'], ['someday'], []];
    return routing.locales.flatMap((locale) =>
        periods.map((period) => ({
            locale,
            period: period.length > 0 ? period : undefined
        }))
    );
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
    const { locale, period: periodParam } = await params;
    setRequestLocale(locale);
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
