import { getUserSteamId, getSteamPlayerSummary, getSteamRecentlyPlayed } from '@/features/media/lib/steam-client';
import { Button } from '@/components/ui/button';
import { Gamepad2, Activity } from 'lucide-react';
import Image from 'next/image';
import { GameMoodSync } from './game-mood-sync';

interface SteamGame {
    appid: number;
    name: string;
    playtime_2weeks: number;
    img_logo_url: string;
}

export async function SteamContainer() {
    const steamId = await getUserSteamId();

    if (!steamId) {
        return (
            <div className="flex flex-col items-center justify-center p-6 space-y-8 h-full min-h-[60vh] relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-cyber opacity-15 pointer-events-none" />
                <div className="p-6 cyber-clip-lg bg-blue-500/10 border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                    <Gamepad2 className="h-16 w-16 text-blue-400 animate-pulse" />
                </div>
                <div className="text-center space-y-3 max-w-md">
                    <h1 className="text-2xl sm:text-3xl font-mono font-extrabold uppercase tracking-wider text-white">
                        STEAM_INTEGRATION_REQUIRED
                    </h1>
                    <p className="text-blue-400/60 font-mono text-xs uppercase leading-relaxed">
                        // Connect your Steam profile to sync gaming activity and telemetry data into the hub.
                    </p>
                </div>
                <Button asChild className="bg-blue-600 text-white font-mono font-bold uppercase tracking-wider h-12 px-8 cyber-clip-button shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500 cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/api/auth/steam">[ CONNECT_STEAM_ACCOUNT ]</a>
                </Button>
            </div>
        );
    }

    const player = await getSteamPlayerSummary();
    const recentGames = await getSteamRecentlyPlayed();

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-mono text-white">
            <div className="border-b border-blue-500/20 pb-4 flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span className="text-[10px] text-blue-400/60 uppercase tracking-widest">// STEAM_TELEMETRY_LINKED</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">GAMING_ACTIVITY</h1>
                </div>
            </div>

            {/* Profile Card */}
            {player && (
                <div className="cyber-panel bg-surface p-6 flex items-center gap-6 border-blue-500/30">
                    <div className="relative w-20 h-20 cyber-clip border border-blue-500/50">
                        <Image src={player.avatarfull} alt={player.personaname} fill className="object-cover" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{player.personaname}</h2>
                        <p className="text-blue-400/70 text-sm">
                            {player.personastate === 1 ? 'Online' : 'Offline'}
                            {player.gameextrainfo && ` • In-Game: ${player.gameextrainfo}`}
                        </p>
                    </div>
                </div>
            )}

            {/* Game Mood Sync Tool */}
            <GameMoodSync />

            {/* Recent Games */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">// RECENTLY_PLAYED</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentGames && recentGames.length > 0 ? (
                        recentGames.map((game: SteamGame) => (
                            <div key={game.appid} className="cyber-panel bg-surface p-4 flex gap-4 border-blue-500/20 hover:border-blue-500/50 transition-colors">
                                <div className="relative w-24 h-12 shrink-0 bg-black cyber-clip-sm">
                                    <Image 
                                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`} 
                                        alt={game.name} 
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{game.name}</p>
                                    <p className="text-xs text-blue-400/60">
                                        {(game.playtime_2weeks / 60).toFixed(1)} hrs (past 2 weeks)
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-blue-400/50 text-sm">No recent activity detected.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
