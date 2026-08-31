import { getUserSteamId, getSteamPlayerSummary, getSteamRecentlyPlayed, type SteamRecentGame } from '@/features/media/lib/steam-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Activity } from 'lucide-react';
import Image from 'next/image';
import { GameMoodSync } from './game-mood-sync';

export async function SteamContainer() {
    const steamId = await getUserSteamId();

    if (!steamId) {
        return (
            <Card className="flex flex-col items-center justify-center p-6 space-y-8 h-full min-h-[60vh] border-blue-500/20">
                <CardContent className="flex flex-col items-center justify-center pt-6 space-y-8">
                    <div className="p-6 cyber-clip-lg bg-blue-500/10 border border-blue-500/40 glow-cyan">
                        <Gamepad2 className="h-16 w-16 text-blue-400 animate-cyber-pulse-slow" />
                    </div>
                    <div className="text-center space-y-3 max-w-md">
                        <h1 className="text-2xl sm:text-3xl font-mono font-extrabold uppercase tracking-wider text-glow-cyan text-white">
                            STEAM_INTEGRATION_REQUIRED
                        </h1>
                        <p className="text-blue-400/60 font-mono text-xs uppercase leading-relaxed">
                            // Connect your Steam profile to sync gaming activity and telemetry data into the hub.
                        </p>
                    </div>
                    <Button asChild variant="cta" className="h-12 px-8">
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/api/auth/steam">[ CONNECT_STEAM_ACCOUNT ]</a>
                    </Button>
                </CardContent>
            </Card>
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
                <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-blue-500/30 p-6">
                    <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 cyber-clip border border-blue-500/50">
                            <Image src={player.avatarfull} alt={player.personaname} fill className="object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white">{player.personaname}</h2>
                                <span className={player.personastate === 1 ? "text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30 cyber-clip-button" : "text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-500/10 px-2 py-0.5 border border-slate-500/30 cyber-clip-button"}>
                                    {player.personastate === 1 ? '● ONLINE' : '○ OFFLINE'}
                                </span>
                            </div>
                            <p className="text-blue-400/70 text-sm mt-1">
                                {player.gameextrainfo ? (
                                    <span className="text-glow-cyan text-white font-bold flex items-center gap-2">
                                        <Gamepad2 className="w-4 h-4 text-blue-400 animate-pulse" />
                                        IN-GAME: {player.gameextrainfo}
                                    </span>
                                ) : (
                                    '// Ready for next deployment.'
                                )}
                            </p>
                        </div>
                    </div>

                    {player.gameextrainfo && (
                        <div className="bg-blue-500/10 border border-blue-500/40 p-3.5 cyber-clip flex items-center gap-3 text-xs text-blue-300">
                            <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping shrink-0" />
                            <div>
                                <p className="font-bold text-white uppercase tracking-wider">LIVE TELEMETRY STREAMING</p>
                                <p className="text-[10px] text-blue-400/70">Syncing with OBS Widget & Spotify Game-Mood</p>
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Game Mood Sync Tool */}
            <GameMoodSync />

            {/* Recent Games */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">// RECENTLY_PLAYED & TELEMETRY</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentGames && recentGames.length > 0 ? (
                        recentGames.map((game: SteamRecentGame) => (
                            <Card key={game.appid} className="border-blue-500/20 hover:border-blue-500/50 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <CardContent className="p-4 flex gap-4 pt-4">
                                    <div className="relative w-24 h-14 shrink-0 bg-black cyber-clip-sm border border-blue-500/30 overflow-hidden">
                                        <Image 
                                            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`} 
                                            alt={game.name} 
                                            fill 
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{game.name}</p>
                                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                                            <span className="text-blue-300 font-bold">
                                                {(game.playtime_forever / 60).toFixed(1)}h <span className="text-blue-400/50 font-normal">total</span>
                                            </span>
                                            {game.playtime_2weeks > 0 && (
                                                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 border border-emerald-500/20 text-[10px]">
                                                    +{(game.playtime_2weeks / 60).toFixed(1)}h 2w
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-blue-400/50 text-sm">No recent activity detected.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
