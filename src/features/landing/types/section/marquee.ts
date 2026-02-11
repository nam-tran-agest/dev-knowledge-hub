export interface MarqueeLogo {
    url: string;
    documentId?: string;
    alternativeText?: string;
}

export interface MarqueeSectionProps {
    title: string;
    logos?: MarqueeLogo[];
    background_image?: {
        documentId?: string;
        url: string;
        alternativeText?: string;
    };
}
