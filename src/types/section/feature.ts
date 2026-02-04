export interface FeatureItem {
    title: string;
    slug: string;
    icon: string;
    features: string; // Rich text content (simplified to string for now)
    background_media?: {
        url: string;
    };
}

export interface FeatureSectionProps {
    title: string;
    services: FeatureItem[]; // Keeping property name 'services' or 'features'? User code used 'services', will adapt to 'features' for cleaner API
}
