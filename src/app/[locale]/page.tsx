import { HeroSection } from '@/components/sections/hero-section'
import FeatureSection from '@/components/sections/feature-section';
import ShowcaseSection from '@/components/sections/showcase-section';
import GridLinksSection from '@/components/sections/grid-links-section';
import MarqueeSection from '@/components/sections/marquee-section';
import CaseStudySection from '@/components/sections/case-study-section';
import WhyChooseUsSection from '@/components/sections/why-choose-us-section';
import StatSection from '@/components/sections/stat-section';
import { getMessages } from 'next-intl/server';

export default async function Dashboard() {
  const messages = await getMessages();
  const homeData = messages.home as any;

  return (
    <div>
      <HeroSection
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        ctaLabel={homeData.hero.ctaLabel}
        ctaUrl={homeData.hero.ctaUrl}
        backgroundVideoUrl="/img/home/banner_main.webm"
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
        logos={homeData.marquee.logos.map((logo: any) => ({
          url: logo.url,
          alternativeText: logo.alt
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
        caseStudies={homeData.caseStudy.items.map((item: any) => ({
          ...item,
          image: ''
        }))}
        readMoreLabel={homeData.caseStudy.readMoreLabel}
      />

    </div>
  )
}
