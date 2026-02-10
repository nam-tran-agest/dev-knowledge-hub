import { HeroSection } from '@/components/sections/hero-section'

import ShowcaseSection from '@/components/sections/showcase-section';

import MarqueeSection from '@/components/sections/marquee-section';
import CaseStudySection from '@/components/sections/case-study-section';
import WhyChooseUsSection from '@/components/sections/why-choose-us-section';
import StatSection from '@/components/sections/stat-section';
import { getMessages } from 'next-intl/server';

export default async function Dashboard() {
  const messages = await getMessages();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const homeData = messages.home as any;

  return (
    <div>
      <HeroSection
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        ctaLabel={homeData.hero.ctaLabel}
        ctaUrl={homeData.hero.ctaUrl}
      />

      {/* <FeatureSection
        title={homeData.features.title}
        services={homeData.features.items.map((item: any) => ({
          ...item,
          background_media: { url: '' }
        }))}
      /> */}

      <ShowcaseSection
        title1={homeData.showcase.title1}
        title2={homeData.showcase.title2}
        items={homeData.showcase.items}
        cta={homeData.showcase.cta}
      />

      {/* <GridLinksSection
        title={homeData.gridLinks.title}
        items={homeData.gridLinks.items.map((item: any) => ({
          label: item.label,
          Url: item.url
        }))}
      /> */}

      <MarqueeSection
        title={homeData.marquee.title}
        logos={homeData.marquee.logos.map((logo: { url: string; alt: string; href?: string }) => ({
          url: logo.url,
          alternativeText: logo.alt,
          href: logo.href
        }))}
      />

      <WhyChooseUsSection
        title={homeData.whyChooseUsSection.title}
        items={homeData.whyChooseUsSection.items}
      />

      <StatSection
        title={homeData.statSection.title}
        stats={homeData.statSection.stats}
        features={homeData.statSection.features}
        cta={homeData.statSection.cta}
      />

      <CaseStudySection
        title={homeData.caseStudy.title}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        caseStudies={((homeData.caseStudy as any).items || []).map((item: any) => ({
          ...item,
          image: ''
        }))}
        readMoreLabel={homeData.caseStudy.readMoreLabel}
      />

    </div>
  )
}
