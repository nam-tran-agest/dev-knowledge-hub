
export interface BaseEntity {
  id: number | string; // Allow both number and string IDs to fix cast errors
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tag extends BaseEntity {
  label: string;
  name?: string; // Add name alias
  slug: string;
  color?: string;
}

export interface Category extends BaseEntity {
  label: string;
  name?: string; // Add name alias
  slug: string;
  description?: string;
  color?: string; // Add missing color
}

export interface TaggableEntity {
  tags?: Tag[];
  category?: Category | null; // Allow null
}

export interface Meta {
  pagination: {
    start: number;
    limit: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  meta: Meta;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

export interface AppImageDataType {
  documentId?: string;
  url: string;
  alternativeText?: string;
}

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
