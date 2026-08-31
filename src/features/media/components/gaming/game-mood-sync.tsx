'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Radio, Loader2, Music, CheckCircle2, XCircle } from 'lucide-react';

export function GameMoodSync() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [resultData, setResultData] = useState<{ gameName?: string, playlistUri?: string, tags?: string[] } | null>(null);

    const handleSync = async () => {
        setStatus('loading');
        setResultData(null);
        try {
            const res = await fetch('/api/media/sync-game-mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ forcePlay: true })
            });
            const data = await res.json();

            if (!res.ok || data.error) {
                setStatus('error');
                if (data.error === 'STEAM_NOT_CONNECTED') setMessage('Steam is not connected.');
                else if (data.error === 'SPOTIFY_NOT_CONNECTED') setMessage('Spotify is not connected.');
                else if (data.error === 'NO_ACTIVE_DEVICE') setMessage('No active Spotify device. Open Spotify first!');
                else setMessage('Error syncing game mood.');
                
                if (data.playlistUri) setResultData({ gameName: data.gameName, playlistUri: data.playlistUri, tags: data.matchedTags });
                return;
            }

            if (data.status === 'idle') {
                setStatus('idle');
                setMessage('You are not playing any game on Steam right now.');
                return;
            }

            setStatus('success');
            setMessage('Audio bridge established!');
            setResultData({
                gameName: data.gameName,
                playlistUri: data.playlistUri,
                tags: data.matchedTags
            });

        } catch (error) {
            setStatus('error');
            setMessage('Network error.');
        }
    };

    return (
        <div className="cyber-panel bg-surface p-6 border-primary/30 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Radio className="w-24 h-24 text-primary" />
            </div>

            <div className="flex items-center justify-between z-10">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2">
                        <Music className="w-5 h-5 text-primary" />
                        GAME-MOOD AUDIO SYNC
                    </h3>
                    <p className="text-xs text-primary/60 max-w-md">
                        // Automatically detect your current Steam game and override Spotify playback with a mood-matching playlist.
                    </p>
                </div>
                
                <Button 
                    onClick={handleSync} 
                    disabled={status === 'loading'}
                    className="bg-primary hover:bg-primary/80 text-black font-bold uppercase tracking-wider cyber-clip-button"
                >
                    {status === 'loading' ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SYNCING...</>
                    ) : (
                        '[ FORCE_SYNC ]'
                    )}
                </Button>
            </div>

            {/* Results Display */}
            {message && status !== 'loading' && (
                <div className={`p-4 border text-sm font-mono flex items-start gap-3 ${
                    status === 'success' ? 'bg-primary/10 border-primary/40 text-primary' : 
                    status === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-400' : 
                    'bg-white/5 border-white/20 text-white/70'
                }`}>
                    {status === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : 
                     status === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> : 
                     <Radio className="w-5 h-5 shrink-0" />}
                    
                    <div className="space-y-2">
                        <p className="font-bold uppercase tracking-wider">{message}</p>
                        
                        {resultData?.gameName && (
                            <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                                <span className="opacity-60">TARGET_GAME:</span>
                                <span className="text-white">{resultData.gameName}</span>
                                
                                {resultData.tags && resultData.tags.length > 0 && (
                                    <>
                                        <span className="opacity-60">TAG_MATCH:</span>
                                        <span className="text-white">[{resultData.tags.join(', ')}]</span>
                                    </>
                                )}
                                
                                {resultData.playlistUri && (
                                    <>
                                        <span className="opacity-60">SPOTIFY_URI:</span>
                                        <span className="text-white truncate">{resultData.playlistUri}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
