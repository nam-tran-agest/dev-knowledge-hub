export interface NewsItem {
    title: string;
    link: string;
    excerpt: string;
    time: string;
    category: string;
    image: string;
    author: string;
}

export interface NewsCategory {
    name: string;
    icon: React.ReactNode;
    active?: boolean;
}
