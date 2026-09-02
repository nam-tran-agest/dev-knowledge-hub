/**
 * Gọi SteamSpy API để lấy các thẻ (tags) do cộng đồng vote cho một AppID cụ thể.
 * API: https://steamspy.com/api.php?request=appdetails&appid={appId}
 */
export async function getGameTagsFromSteamSpy(appId: string): Promise<string[]> {
    try {
        const res = await fetch(`https://steamspy.com/api.php?request=appdetails&appid=${appId}`, {
            // SteamSpy API is sometimes slow or rate-limited, set a reasonable timeout/cache
            next: { revalidate: 86400 }, // Cache for 24 hours
            signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        
        if (!data || !data.tags || typeof data.tags !== 'object') {
            return [];
        }

        // data.tags is an object: { "FPS": 1500, "Action": 1200, ... }
        // Chuyển thành mảng và sắp xếp giảm dần theo điểm số (số lượt vote)
        const sortedTags = Object.entries(data.tags as Record<string, number>)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);

        return sortedTags.slice(0, 5); // Lấy top 5 cho chắc chắn
    } catch (error) {
        console.error('Lỗi khi fetch SteamSpy:', error);
        return [];
    }
}
