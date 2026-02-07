import { getTranslations } from 'next-intl/server';
import { Globe, Cpu, Gamepad, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XMLParser } from 'fast-xml-parser';

// Modular Components
import { NewsSidebar } from '@/components/news/news-sidebar';
import { NewsHeaderControls } from '@/components/news/news-header-controls';
import { FeaturedArticle } from '@/components/news/featured-article';
import { NewsGrid } from '@/components/news/news-grid';
import { NewsSubscription } from '@/components/news/news-subscription';
import { NewsItem } from '@/components/news/types';

// RSS Feed URLs
const FEEDS = [
    { url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss', author: 'Tuổi Trẻ' },
    { url: 'https://dantri.com.vn/rss/tin-moi-nhat.rss', author: 'Dân Trí' },
    { url: 'https://thanhnien.vn/rss/tin-tong-hop.rss', author: 'Thanh Niên' },
    { url: 'https://vietnamnet.vn/rss/tin-moi-nhat.rss', author: 'VietnamNet' },
    { url: 'https://plo.vn/rss-tin-moi-nhat-110.rss', author: 'PLO' },
];

const CATEGORIES = [
    { name: 'Tất cả', icon: <Globe className="w-4 h-4" />, active: true },
    { name: 'Công nghệ', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Game', icon: <Gamepad className="w-4 h-4" /> },
    { name: 'AI & Tương lai', icon: <Zap className="w-4 h-4" /> },
];

async function getNews(): Promise<NewsItem[]> {
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

                // Enhanced image extraction for multiple sources
                let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";

                // 1. Try search in description CDATA (Tuổi Trẻ, Thanh Niên)
                const imgMatch = description.match(/src="([^"]+)"/);
                if (imgMatch) {
                    imageUrl = imgMatch[1];
                }
                // 2. Try media:content or enclosure (Dân Trí, VietnamNet)
                else if (item.enclosure && item.enclosure.url) {
                    imageUrl = item.enclosure.url;
                } else if (item["media:content"] && item["media:content"].url) {
                    imageUrl = item["media:content"].url;
                }

                // Clean description and normalize for Vietnamese
                const cleanDescription = (description.replace(/<[^>]*>/g, "").split(".")[0] + ".").trim().normalize('NFC');
                const title = (item.title || "").trim().normalize('NFC');
                const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

                return {
                    title: title,
                    link: item.link,
                    excerpt: cleanDescription,
                    time: pubDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + pubDate.toLocaleDateString('vi-VN'),
                    pubDate: pubDate, // Store for sorting
                    category: "Tin mới",
                    image: imageUrl,
                    author: feed.author
                };
            });
        } catch (error) {
            console.error(`Error fetching RSS from ${feed.url}:`, error);
            return [];
        }
    });

    try {
        const results = await Promise.all(allNewsPromises);
        const mergedNews = results.flat() as (NewsItem & { pubDate: Date })[];

        // Sort by date (latest first)
        return mergedNews
            .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
            .map(({ pubDate, ...rest }) => rest);
    } catch (error) {
        console.error("Error aggregating news:", error);
        return [];
    }
}

export default async function NewsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'media.news' });
    const newsItems = await getNews();

    const featuredItem = newsItems[0];
    const trendingItems = newsItems.slice(1, 10); // More trending items from merged sources
    const feedItems = newsItems.slice(10, 40); // Larger feed from merged sources

    if (newsItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 bg-[#0a0a0c] text-center">
                <h2 className="text-2xl font-bold">Không có tin tức nào để hiển thị.</h2>
                <p className="text-slate-500 mt-2">Vui lòng thử lại sau.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-[#0a0a0c] text-slate-200">
            <div className="flex flex-col lg:flex-row overflow-hidden">

                {/* Local Sidebar */}
                <NewsSidebar categories={CATEGORIES} trendingItems={trendingItems} />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col bg-[#0a0a0c]">
                    <NewsHeaderControls />

                    <ScrollArea className="flex-1">
                        <div className="px-8 py-8 space-y-12 max-w-6xl mx-auto">
                            {featuredItem && <FeaturedArticle item={featuredItem} />}
                            <NewsGrid items={feedItems} />
                            <NewsSubscription />
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
