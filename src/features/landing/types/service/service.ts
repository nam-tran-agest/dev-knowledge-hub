import { AppImageDataType } from '@/types/base';

export interface ServiceWhyChooseUsItem {
    id: string | number;
    title: string;
    subTitle: string;
}

export interface ServiceWhyChooseUsProps {
    title?: string;
    image?: AppImageDataType;
    items: ServiceWhyChooseUsItem[];
}
