import { createClient } from '@/lib/supabase/server';
import { getGameTagsFromSteamSpy } from '@/features/media/lib/steam-spy-client';
import genreMappingData from '@/features/media/data/genre_mapping.json';

interface Mapping {
    vibe: string;
    tags: string[];
    playlistUri: string;
}

const genreMappings = genreMappingData.mappings as Mapping[];
const fallbackPlaylist = genreMappingData.fallbackPlaylistUri;

export async function matchGameToPlaylist(appId: string): Promise<{ playlistUri: string; matchedTags: string[] }> {
    const supabase = await createClient();

    // 1. Quét DB Cache nội bộ (Cực nhanh, < 10ms)
    const { data: cached } = await supabase
        .from('game_playlist_cache')
        .select('*')
        .eq('app_id', appId)
        .single();

    if (cached && cached.playlist_uri) {
        return {
            playlistUri: cached.playlist_uri,
            matchedTags: cached.matched_tags || []
        };
    }

    // 2. Cache Miss -> Gọi SteamSpy API (Chỉ gọi lần đầu cho mỗi game)
    const tags = await getGameTagsFromSteamSpy(appId);
    
    let matchedPlaylist = fallbackPlaylist;
    let matchedTagsForDB: string[] = [];

    // 3. Scoring Logic
    if (tags && tags.length > 0) {
        const top3Tags = tags.slice(0, 3);
        
        // Duyệt qua từ điển để tìm Vibe khớp
        for (const mapping of genreMappings) {
            // Tìm sự giao thoa (intersection) giữa top3Tags của game và tags của Vibe
            const intersection = top3Tags.filter(tag => mapping.tags.includes(tag));
            if (intersection.length > 0) {
                matchedPlaylist = mapping.playlistUri;
                matchedTagsForDB = intersection;
                break; // Thoát ngay khi tìm thấy Vibe phù hợp nhất (ưu tiên Vibe xếp trên)
            }
        }
        
        if (matchedTagsForDB.length === 0) {
            // Nếu Top 3 không khớp, thử với toàn bộ 5 thẻ
            for (const mapping of genreMappings) {
                const intersection = tags.filter(tag => mapping.tags.includes(tag));
                if (intersection.length > 0) {
                    matchedPlaylist = mapping.playlistUri;
                    matchedTagsForDB = intersection;
                    break;
                }
            }
        }
    }

    // Nếu không khớp thẻ nào, lưu là mảng rỗng để biết là dùng fallback
    if (matchedTagsForDB.length === 0 && tags.length > 0) {
        matchedTagsForDB = [tags[0]]; // Lưu lại tag cao nhất để tham khảo
    }

    // 4. Lưu lại vào Global Cache
    try {
        await supabase.from('game_playlist_cache').upsert({
            app_id: appId,
            playlist_uri: matchedPlaylist,
            matched_tags: matchedTagsForDB,
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.error('Failed to update game cache', e);
    }

    return {
        playlistUri: matchedPlaylist,
        matchedTags: matchedTagsForDB
    };
}
