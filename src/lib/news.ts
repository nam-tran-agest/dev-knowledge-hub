import { XMLParser } from 'fast-xml-parser';
import { NewsItem } from '@/components/news/types';

export const FEEDS = [
    {
        url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
        author: 'Tuổi Trẻ',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/archive/1/1f/20210912015238%21Tu%E1%BB%95i_Tr%E1%BA%BB_Logo.svg/120px-Tu%E1%BB%95i_Tr%E1%BA%BB_Logo.svg.png'
    },
    {
        url: 'https://dantri.com.vn/rss/home.rss',
        author: 'Dân Trí',
        logo: 'https://cdnphoto.dantri.com.vn/VvtOwI074vZ8p5VN2--3a5gGTgQ=/2025/07/15/logo-3png-1752569761698.png'
    },
    {
        url: 'https://thanhnien.vn/rss/home.rss',
        author: 'Thanh Niên',
        logo: 'https://static.thanhnien.com.vn/thanhnien.vn/image/logo-40-nam-trang-chu.svg'
    },
    {
        url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
        author: 'VNExpress',
        logo: 'https://s1.vnecdn.net/vnexpress/restruct/i/v9779/v2_2019/pc/graphics/logo.svg'
    },
    {
        url: 'https://plo.vn/rss/home.rss',
        author: 'PLO',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Logo_B%C3%A1o_Ph%C3%A1p_Lu%E1%BA%ADt_TP.HCM.png/1280px-Logo_B%C3%A1o_Ph%C3%A1p_Lu%E1%BA%ADt_TP.HCM.png'
    },
];

export const CATEGORIES = [
    { id: 'all', name: 'All', active: true },
    { id: 'tech-science', name: 'Technology & Science' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'ai-future', name: 'AI & Future' },
    { id: 'world', name: 'World' },
    { id: 'health', name: 'Health' },
    { id: 'business', name: 'Business' },
    { id: 'sports', name: 'Sports' },
    { id: 'education', name: 'Education' },
];

export async function getNews(): Promise<NewsItem[]> {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    const allNewsPromises = FEEDS.map(async (feed) => {
        try {
            const response = await fetch(feed.url, { next: { revalidate: 3600 } });
            if (!response.ok) return [];

            const xmlData = await response.text();
            const result = parser.parse(xmlData);
            const channel = result.rss.channel;
            const items = Array.isArray(channel.item) ? channel.item : [channel.item];

            return items.filter((item: any) => item).map((item: any) => {
                const description = item.description || "";

                let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

                const imgMatch = description.match(/src="([^"]+)"/);
                if (imgMatch) {
                    imageUrl = imgMatch[1];
                }
                else if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                } else if (item["media:content"] && item["media:content"].url) {
                    imageUrl = item["media:content"].url;
                }

                const cleanDescription = (description.replace(/<[^>]*>/g, "").split(".")[0] + ".").trim().normalize('NFC');
                const title = (item.title || "").trim().normalize('NFC');
                const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

                return {
                    title: title,
                    link: item.link,
                    excerpt: cleanDescription,
                    time: pubDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + pubDate.toLocaleDateString('vi-VN'),
                    pubDate: pubDate,
                    category: "Tin mới",
                    image: imageUrl,
                    author: feed.author,
                    sourceLogo: feed.logo
                } as NewsItem & { pubDate: Date };
            });
        } catch (error) {
            console.error(`Error fetching RSS from ${feed.url}:`, error);
            return [];
        }
    });

    try {
        const results = await Promise.all(allNewsPromises);
        const mergedNews = results.flat() as (NewsItem & { pubDate: Date })[];

        return mergedNews
            .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
            .map(({ pubDate, ...rest }) => rest);
    } catch (error) {
        console.error("Error aggregating news:", error);
        return [];
    }
}
