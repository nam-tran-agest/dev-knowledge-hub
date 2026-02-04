import { StrapiImageDataType } from "@/types/base";

export interface WhyChooseUsStat {
    id?: string | number;
    value: number;
    suffix: string;
    title: string;
}

export interface WhyChooseUsFeature {
    id?: string | number;
    title: string;
    sub_title: string;
    image?: StrapiImageDataType;
}

export interface WhyChooseUsSection {
    title: string;
    stats: WhyChooseUsStat[];
    features: WhyChooseUsFeature[];
    cta?: {
        id?: string;
        label: string;
        url?: string;
        Url?: string; // Handle both cases for safety
    };
}
