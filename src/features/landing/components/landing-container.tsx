import { HeroSection } from '@/features/landing/components/hero-section'
import ShowcaseSection from '@/features/landing/components/showcase-section';
import MarqueeSection from '@/features/landing/components/marquee-section';
import CaseStudySection from '@/features/landing/components/case-study-section';
import WhyChooseUsSection from '@/features/landing/components/why-choose-us-section';
import StatSection from '@/features/landing/components/stat-section';
import { getTranslations } from 'next-intl/server';
import type { ShowcaseItem } from "@/features/landing/types/section/showcase";
import type { MarqueeLogo } from "@/features/landing/types/section/marquee";
import type { WhyChooseUsStat, WhyChooseUsFeature } from "@/features/landing/types/section/why-choose-us";
import type { CaseStudyItem } from "@/features/landing/types/section/case-study";

interface LandingContainerProps {
    locale: string;
}

export async function LandingContainer({ locale }: LandingContainerProps) {
    const t = await getTranslations({ locale, namespace: 'home' });

    return (
        <>
            <HeroSection
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                ctaLabel={t('hero.ctaLabel')}
                ctaUrl={t('hero.ctaUrl')}
            />

            {/* FeatureSection commented out in original */}

            <ShowcaseSection
                title1={t('showcase.title1')}
                title2={t('showcase.title2')}
                items={t.raw('showcase.items') as ShowcaseItem[]}
                cta={t.raw('showcase.cta') as { label: string; url: string; id?: string }}
            />

            {/* GridLinksSection commented out in original */}

            <MarqueeSection
                title={t('marquee.title')}
                logos={(t.raw('marquee.logos') as MarqueeLogo[]).map((logo) => ({
                    url: logo.url,
                    alternativeText: logo.alternativeText || '',
                    href: ''
                }))}
            />

            <WhyChooseUsSection
                title={t('whyChooseUsSection.title')}
                items={(t.raw('whyChooseUsSection.items') as WhyChooseUsFeature[]).map((item, idx) => ({
                    id: item.id || idx,
                    title: item.title,
                    subTitle: item.sub_title
                }))}
            />

            <StatSection
                title={t('statSection.title')}
                stats={t.raw('statSection.stats') as WhyChooseUsStat[]}
                features={t.raw('statSection.features') as WhyChooseUsFeature[]}
                cta={t.raw('statSection.cta') as { label: string; url?: string; id?: string }}
            />

            <CaseStudySection
                title={t('caseStudy.title')}
                caseStudies={(t.raw('caseStudy.items') as CaseStudyItem[] || []).map((item) => ({
                    ...item,
                    image: ''
                }))}
                readMoreLabel={t('caseStudy.readMoreLabel')}
            />
        </>
    )
}
