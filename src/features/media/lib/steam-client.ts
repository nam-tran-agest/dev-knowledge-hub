'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Retrieves the linked SteamID64 for the current user.
 */
export async function getUserSteamId(): Promise<string | null> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll() { /* Ignored */ },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: integration, error } = await supabase
        .from('steam_credentials')
        .select('steam_id64')
        .eq('user_id', user.id)
        .single();

    if (error || !integration || !integration.steam_id64) {
        return null;
    }

    return integration.steam_id64;
}

export interface SteamPlayerSummary {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personastate: number;
    gameextrainfo?: string;
    gameid?: string;
}

export interface SteamRecentGame {
    appid: number;
    name: string;
    playtime_2weeks: number;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
}

// Steam API Methods
export async function getSteamPlayerSummary(): Promise<SteamPlayerSummary | null> {
    const steamId = await getUserSteamId();
    const apiKey = process.env.STEAM_WEB_API_KEY;

    if (!steamId || !apiKey) return null;

    try {
        const res = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
            { signal: AbortSignal.timeout(5000) }
        );

        if (!res.ok) return null;
        const data = (await res.json()) as { response?: { players?: SteamPlayerSummary[] } };
        return data.response?.players?.[0] || null;
    } catch (error) {
        console.error('Error fetching Steam player summary:', error);
        return null;
    }
}

export async function getSteamRecentlyPlayed(): Promise<SteamRecentGame[]> {
    const steamId = await getUserSteamId();
    const apiKey = process.env.STEAM_WEB_API_KEY;

    if (!steamId || !apiKey) return [];

    try {
        const res = await fetch(
            `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`,
            { signal: AbortSignal.timeout(5000) }
        );

        if (!res.ok) return [];
        const data = (await res.json()) as { response?: { games?: SteamRecentGame[] } };
        return data.response?.games || [];
    } catch (error) {
        console.error('Error fetching Steam recently played games:', error);
        return [];
    }
}
