export interface ShowcaseItem {
    id?: string;
    title: string;
    sub_title: string;
    image?: {
        url: string;
    };
}

export interface ShowcaseSectionProps {
    title1: string;
    title2?: string;
    items: ShowcaseItem[];
    cta?: {
        id?: string;
        url?: string;
        Url?: string; // fallback in case of Strapi case inconsistencies
        label: string;
    };
}
