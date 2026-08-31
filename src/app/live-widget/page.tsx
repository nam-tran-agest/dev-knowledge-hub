'use client';

import { useEffect, useState } from 'react';
import { Gamepad2, Music2 } from 'lucide-react';
import Image from 'next/image';

interface TelemetryData {
    steam: {
        personaname: string;
        avatar: string;
        state: number;
        game: string | null;
        gameId: string | null;
    } | null;
    spotify: {
        isPlaying: boolean;
        songName: string;
        artistName: string;
        albumArt: string;
        progress_ms: number;
        duration_ms: number;
    } | null;
}

export default function LiveWidgetPage() {
    const [data, setData] = useState<TelemetryData | null>(null);

    useEffect(() => {
        const fetchTelemetry = async () => {
            try {
                const res = await fetch('/api/media/now-playing');
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchTelemetry();
        // Poll every 10 seconds
        const interval = setInterval(fetchTelemetry, 10000);
        return () => clearInterval(interval);
    }, []);

    if (!data) return null;

    const { steam, spotify } = data;
    
    // Nếu không chơi game và không nghe nhạc thì ẩn luôn widget cho đỡ chật màn hình stream
    if (!steam?.game && !spotify?.isPlaying) {
        return null;
    }

    return (
        <div className="p-4 flex flex-col gap-3 font-mono" style={{ width: '380px' }}>
            {/* Steam Module */}
            {steam?.game && (
                <div className="relative p-3 glass-panel border-blue-500/30 overflow-hidden flex items-center gap-4 cyber-clip-sm">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    <div className="relative w-12 h-12 shrink-0 border border-blue-500/50 cyber-clip">
                        <Image src={`https://media.steampowered.com/steamcommunity/public/images/apps/${steam.gameId}/header.jpg`} 
                            alt={steam.game} 
                            fill 
                            className="object-cover"
                            unoptimized 
                        />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 text-blue-400 mb-0.5">
                            <Gamepad2 className="w-3 h-3 animate-cyber-pulse-slow" />
                            <span className="text-[9px] font-bold tracking-widest uppercase text-glow-cyan">NOW PLAYING</span>
                        </div>
                        <p className="text-sm font-bold text-white truncate shadow-black drop-shadow-md">{steam.game}</p>
                    </div>
                </div>
            )}

            {/* Spotify Module */}
            {spotify?.isPlaying && (
                <div className="relative p-3 glass-panel border-emerald-500/30 overflow-hidden flex items-center gap-4 cyber-clip-sm">
                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
                    
                    <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-emerald-500/50 animate-[spin_4s_linear_infinite]">
                        {spotify.albumArt ? (
                            <Image src={spotify.albumArt} alt={spotify.songName} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <Music2 className="w-5 h-5 text-emerald-500" />
                            </div>
                        )}
                        {/* Center hole for vinyl effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#040612] rounded-full border border-emerald-500/30" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 text-emerald-400 mb-0.5">
                            <Music2 className="w-3 h-3 animate-cyber-pulse-slow" />
                            <span className="text-[9px] font-bold tracking-widest uppercase" style={{ textShadow: '0 0 12px rgba(16,185,129,0.75)' }}>AUDIO STREAM</span>
                        </div>
                        <p className="text-sm font-bold text-white truncate drop-shadow-md">{spotify.songName}</p>
                        <p className="text-[10px] text-emerald-100/60 truncate">{spotify.artistName}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
