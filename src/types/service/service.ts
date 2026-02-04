import { StrapiImageDataType } from '../base';

export interface ServiceWhyChooseUsItem {
    id: string | number;
    title: string;
    subTitle: string;
}

export interface ServiceWhyChooseUsProps {
    title?: string;
    image?: StrapiImageDataType;
    items: ServiceWhyChooseUsItem[];
}
