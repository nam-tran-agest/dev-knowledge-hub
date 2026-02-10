import { XMLParser } from 'fast-xml-parser';
import { NewsItem } from '@/types/news';
import { FEEDS, CATEGORIES } from '@/config/news-feeds';

export { FEEDS, CATEGORIES };

export async function getNews(categoryId?: string): Promise<NewsItem[]> {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    });

    const targetFeeds = categoryId && categoryId !== 'all'
        ? FEEDS.filter(f => (f as { category?: string }).category === categoryId)
        : FEEDS.filter(f => !(f as { category?: string }).category); // Default to general feeds for 'all'

    const allNewsPromises = targetFeeds.map(async (feed) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        try {
            const response = await fetch(feed.url, {
                next: { revalidate: 0 },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) return [];

            const xmlData = await response.text();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = parser.parse(xmlData) as any;
            if (!result?.rss?.channel) return [];

            const channel = result.rss.channel;
            const rawItems = Array.isArray(channel.item) ? channel.item : [channel.item];
            // Limit to top 15 items per feed to avoid Worker resource limits
            const items = rawItems.slice(0, 15).filter((item: unknown) => !!item);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const typedItems = items as any[];

            return typedItems.map((item) => {
                let imageUrl = '';
                const description = item.description || "";
                const contentEncoded = item["content:encoded"] || "";

                // 1. Try media:thumbnail
                if (item["media:thumbnail"] && item["media:thumbnail"].url) {
                    imageUrl = item["media:thumbnail"].url;
                }

                // 2. Try media:content
                if (!imageUrl && item["media:content"]) {
                    const media = Array.isArray(item["media:content"]) ? item["media:content"][0] : item["media:content"];
                    if (media && media.url) imageUrl = media.url;
                }

                // 3. Try description for <img> tag
                if (!imageUrl) {
                    const imgMatch = description.match(/<img[^>]+src=['"]([^'"]+)['"]/i) ||
                        description.match(/src=['"]([^'"]+)['"]/i);
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
                    }
                }

                // 4. Try direct image or thumb tags (common for PLO)
                if (!imageUrl && item.image && typeof item.image === 'string') {
                    imageUrl = item.image;
                }
                if (!imageUrl && item.thumb && typeof item.thumb === 'string') {
                    imageUrl = item.thumb;
                }

                // 4. Try enclosure (only if image)
                if (!imageUrl && item.enclosure && item.enclosure.url) {
                    const type = item.enclosure.type || "";
                    if (type.startsWith('image/')) {
                        imageUrl = item.enclosure.url;
                    }
                }

                // 6. Try content:encoded (common for WordPress feeds like PlayStation Blog)
                if (!imageUrl && contentEncoded) {
                    const imgMatch = contentEncoded.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
                    if (imgMatch) {
                        imageUrl = imgMatch[1];
                        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
                    }
                }

                // Filter out non-image URLs (like SoundCloud players, iframes, etc.)
                if (imageUrl && (
                    imageUrl.includes('soundcloud.com') ||
                    imageUrl.includes('player/') ||
                    imageUrl.includes('youtube.com/embed') ||
                    imageUrl.includes('facebook.com/plugins') ||
                    imageUrl.includes('iframe')
                )) {
                    imageUrl = '';
                }
                if (!imageUrl) {
                    imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";
                }

                const cleanDescription = decodeEntities((description.replace(/<[^>]*>/g, "").split(".")[0] + ".").trim().normalize('NFC'));
                const title = decodeEntities((item.title || "").trim().normalize('NFC'));
                const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

                return {
                    title: title,
                    link: item.link,
                    excerpt: cleanDescription,
                    time: pubDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + pubDate.toLocaleDateString('vi-VN'),
                    pubDate: pubDate,
                    category: categoryId ? CATEGORIES.find(c => c.id === categoryId)?.name || "" : "Latest",
                    categoryId: categoryId || 'all',
                    image: imageUrl,
                    author: feed.author,
                    sourceLogo: feed.logo,
                    isoDate: pubDate.toISOString()
                } as NewsItem & { pubDate: Date };
            });
        } catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                console.error(`Timeout fetching RSS from ${feed.url}`);
            } else {
                console.error(`Error fetching RSS from ${feed.url}:`, error);
            }
            return [];
        }
    });

    try {
        const results = await Promise.all(allNewsPromises);
        const mergedNews = (results.flat() as (NewsItem & { pubDate: Date })[]).filter(item => item != null);

        // Deduplicate by link to prevent duplicate React keys
        const seenLinks = new Set<string>();
        const uniqueNews = mergedNews.filter(item => {
            if (seenLinks.has(item.link)) return false;
            seenLinks.add(item.link);
            return true;
        });

        return uniqueNews
            .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
            .map(({ ...rest }) => rest);
    } catch (error) {
        console.error("Error aggregating news:", error);
        return [];
    }
}

function decodeEntities(text: string): string {
    if (!text) return "";

    const translate: Record<string, string> = {
        "nbsp": " ",
        "amp": "&",
        "quot": "\"",
        "lt": "<",
        "gt": ">",
        "apos": "'",
        "lsquo": "‘",
        "rsquo": "’",
        "ldquo": "“",
        "rdquo": "”",
        "ndash": "–",
        "mdash": "—",
        "hellip": "…",
        // Vietnamese common entities
        "aacute": "á", "agrave": "à", "ả": "ả", "atilde": "ã", "ạ": "ạ",
        "Aacute": "Á", "Agrave": "À", "Ả": "Ả", "Atilde": "Ã", "Ạ": "Ạ",
        "eacute": "é", "egrave": "è", "ẻ": "ẻ", "ẽ": "ẽ", "ẹ": "ẹ",
        "Eacute": "É", "Egrave": "È", "Ẻ": "Ẻ", "Ẽ": "Ẽ", "Ẹ": "Ẹ",
        "iacute": "í", "igrave": "ì", "ỉ": "ỉ", "ĩ": "ĩ", "ị": "ị",
        "Iacute": "Í", "Igrave": "Ì", "Ỉ": "Ỉ", "Ĩ": "Ĩ", "Ị": "Ị",
        "oacute": "ó", "ograve": "ò", "ỏ": "ỏ", "otilde": "õ", "ọ": "ọ",
        "Oacute": "Ó", "Ograve": "Ò", "Ỏ": "Ỏ", "Otilde": "Õ", "Ọ": "Ọ",
        "uacute": "ú", "ugrave": "ù", "ủ": "ủ", "utilde": "ũ", "ụ": "ụ",
        "Uacute": "Ú", "Ugrave": "Ù", "Ủ": "Ủ", "Utilde": "Ũ", "Ụ": "Ụ",
        "yacute": "ý", "ygrave": "ỳ", "ỷ": "ỷ", "ỹ": "ỹ", "ỵ": "ỵ",
        "Yacute": "Ý", "Ygrave": "Ỳ", "Ỷ": "Ỷ", "Ỹ": "Ỹ", "Ỵ": "Ỵ",
        "acirc": "â", "ecirc": "ê", "ocirc": "ô", "ư": "ư", "ơ": "ơ", "đ": "đ",
        "Acirc": "Â", "Ecirc": "Ê", "Ocirc": "Ô", "Ư": "Ư", "Ơ": "Ơ", "Đ": "Đ",
    };

    // Decode numerical entities and standard named entities
    let decoded = text.replace(/&(?:#(\d+)|#x([\da-fA-F]+)|(\w+));/g, (match, dec, hex, name) => {
        if (dec) return String.fromCharCode(parseInt(dec, 10));
        if (hex) return String.fromCharCode(parseInt(hex, 16));
        if (name && translate[name]) return translate[name];
        return match;
    });

    // Final cleanup for any missed double-encoded entities or non-standard ones
    // Sometimes RSS has things like &amp;atilde;
    if (decoded.includes('&')) {
        decoded = decoded.replace(/&(?:#(\d+)|#x([\da-fA-F]+)|(\w+));/g, (match, dec, hex, name) => {
            if (dec) return String.fromCharCode(parseInt(dec, 10));
            if (hex) return String.fromCharCode(parseInt(hex, 16));
            if (name && translate[name]) return translate[name];
            return match;
        });
    }

    return decoded.trim();
}
