export interface GridLinkItem {
    label: string;
    Url?: string; // Upper case per user code
    image?: {
        documentId?: string;
        url: string;
        alternativeText?: string;
    };
}

export interface GridLinksSectionProps {
    title: string;
    items: GridLinkItem[];
}
