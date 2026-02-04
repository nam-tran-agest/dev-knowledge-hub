export interface CaseStudyItem {
    title: string;
    slug: string;
    description: string;
    image?: string; // User code passed this to getStrapiMedia(caseStudy.image), so string or {url}
}

export interface ServiceCaseStudiesProps {
    title: string;
    readMoreLabel?: string;
    caseStudies: CaseStudyItem[];
}
