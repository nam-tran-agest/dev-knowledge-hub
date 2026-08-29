import { HeroSection } from '@/features/landing/components/hero-section'
import { getTranslations } from 'next-intl/server';

interface LandingContainerProps {
    locale: string;
}

export async function LandingContainer({ locale }: LandingContainerProps) {
    const t = await getTranslations({ locale, namespace: 'home' });

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                ctaLabel={t('hero.ctaLabel')}
                ctaUrl={t('hero.ctaUrl')}
            />
        </div>
    )
}
