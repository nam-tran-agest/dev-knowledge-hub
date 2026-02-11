import type { AppImageDataType } from './base';

export interface FooterLink {
    label: string;
    url: string;
}

export interface SocialLink extends FooterLink {
    icon?: AppImageDataType;
}

export interface FooterAddress {
    id: string;
    title: string;
    content: string;
}

export interface FooterData {
    logo?: AppImageDataType;
    email: string;
    phone: string;
    copyright: string;
    social_links: SocialLink[];
    footer_sections: FooterLink[];
    addresses: FooterAddress[];
    certifications?: {
        url: string;
        icon?: AppImageDataType;
    }[];
    policy_links?: FooterLink[];
    partners?: {
        icon?: AppImageDataType;
    }[];
}

export interface NavbarItem {
    id: string;
    label: string;
    url: string;
    open_in_new_tab?: boolean;
    sub_items: {
        label: string;
        url: string;
    }[];
}

export interface NavbarData {
    navbar_items: NavbarItem[];
}
