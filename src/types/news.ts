export interface NewsItem {
    title: string;
    link: string;
    excerpt: string;
    time: string;
    category: string;
    categoryId?: string;
    image: string;
    author: string;
    sourceLogo?: string;
    isoDate?: string;
}

export interface NewsCategory {
    id: string;
    name: string;
    icon?: React.ReactNode;
    active?: boolean;
}
