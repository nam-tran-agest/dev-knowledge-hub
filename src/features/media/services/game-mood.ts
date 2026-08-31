import { createClient } from '@/lib/supabase/server';
import { getGameTagsFromSteamSpy } from '@/features/media/lib/steam-spy-client';
import { getSpotifyAuthToken } from '@/features/media/services/spotify';
import { searchSpotifyPlaylists } from '@/features/media/services/spotify-api';
import genreMappingData from '@/features/media/data/genre_mapping.json';

interface Mapping {
    vibe: string;
    tags: string[];
    searchQueries: string[];
}

const genreMappings = genreMappingData.mappings as Mapping[];
const fallbackQueries = genreMappingData.fallbackQueries;

export async function matchGameToPlaylist(appId: string): Promise<{ playlistUri: string; matchedTags: string[] }> {
    const supabase = await createClient();
    
    let matchedTagsForDB: string[] = [];
    let matchedQueries: string[] = fallbackQueries;

    // 1. Quét DB Cache nội bộ lấy Tags (Tránh spam API SteamSpy)
    const { data: cached } = await supabase
        .from('game_playlist_cache')
        .select('*')
        .eq('app_id', appId)
        .single();

    if (cached && cached.matched_tags && cached.matched_tags.length > 0) {
        matchedTagsForDB = cached.matched_tags;
        
        // Tìm lại Vibe dựa trên tags trong Cache
        for (const mapping of genreMappings) {
            const intersection = matchedTagsForDB.filter(tag => mapping.tags.includes(tag));
            if (intersection.length > 0) {
                matchedQueries = mapping.searchQueries;
                break;
            }
        }
    } else {
        // 2. Cache Miss -> Gọi SteamSpy API lấy Tags mới
        const tags = await getGameTagsFromSteamSpy(appId);
        
        if (tags && tags.length > 0) {
            const top3Tags = tags.slice(0, 3);
            
            // Tìm Vibe khớp nhất
            for (const mapping of genreMappings) {
                const intersection = top3Tags.filter(tag => mapping.tags.includes(tag));
                if (intersection.length > 0) {
                    matchedQueries = mapping.searchQueries;
                    matchedTagsForDB = intersection;
                    break;
                }
            }
            
            if (matchedTagsForDB.length === 0) {
                // Thử với toàn bộ tags
                for (const mapping of genreMappings) {
                    const intersection = tags.filter(tag => mapping.tags.includes(tag));
                    if (intersection.length > 0) {
                        matchedQueries = mapping.searchQueries;
                        matchedTagsForDB = intersection;
                        break;
                    }
                }
            }
        }

        if (matchedTagsForDB.length === 0 && tags && tags.length > 0) {
            matchedTagsForDB = [tags[0]]; // Lưu tạm tag cao nhất
        }
    }

    // 3. TÌM KIẾM NHẠC ĐỘNG TRÊN SPOTIFY
    // Chọn ngẫu nhiên 1 từ khóa trong tập hợp (Randomness 1)
    const randomQuery = matchedQueries[Math.floor(Math.random() * matchedQueries.length)];
    
    let finalPlaylistUri = "spotify:playlist:37i9dQZF1DWTyiBJ6yEqeu"; // Fallback tối thượng
    const token = await getSpotifyAuthToken();
    
    if (token) {
        // Gọi API tìm kiếm
        const playlists = await searchSpotifyPlaylists(token, randomQuery);
        
        // Lọc bỏ những playlist bị rỗng hoặc lỗi
        const validPlaylists = playlists.filter((p: any) => p && p.uri);
        
        if (validPlaylists.length > 0) {
            // Chọn ngẫu nhiên 1 playlist trong top 15 kết quả trả về (Randomness 2)
            const randomPlaylist = validPlaylists[Math.floor(Math.random() * validPlaylists.length)];
            finalPlaylistUri = randomPlaylist.uri;
        }
    }

    // 4. Lưu hoặc cập nhật Cache (Chỉ cache Tags, Playlist_URI được random mỗi lần gọi)
    try {
        await supabase.from('game_playlist_cache').upsert({
            app_id: appId,
            playlist_uri: finalPlaylistUri, // Vẫn lưu playlist cuối cùng được chọn để tham khảo
            matched_tags: matchedTagsForDB,
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.error('Failed to update game cache', e);
    }

    return {
        playlistUri: finalPlaylistUri,
        matchedTags: matchedTagsForDB
    };
}
