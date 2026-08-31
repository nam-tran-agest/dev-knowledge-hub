'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

        } catch {
            setStatus('error');
            setMessage('Network error.');
        }
    };

    return (
        <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                <Radio className="w-24 h-24 text-primary" />
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-primary" />
                        GAME-MOOD AUDIO SYNC
                    </CardTitle>
                    <CardDescription className="max-w-md">
                        // Automatically detect your current Steam game and override Spotify playback with a mood-matching playlist.
                    </CardDescription>
                </div>
                
                <Button 
                    variant="cta"
                    onClick={handleSync} 
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SYNCING...</>
                    ) : (
                        '[ FORCE_SYNC ]'
                    )}
                </Button>
            </CardHeader>

            <CardContent className="relative z-10 pt-4">
                {message && status !== 'loading' && (
                    <div className={`p-4 border text-sm font-mono flex items-start gap-3 backdrop-blur-md cyber-clip ${
                        status === 'success' ? 'bg-primary/10 border-primary/40 text-primary' : 
                        status === 'error' ? 'bg-destructive/10 border-destructive/40 text-destructive' : 
                        'bg-white/5 border-white/20 text-white/70'
                    }`}>
                        {status === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : 
                         status === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> : 
                         <Radio className="w-5 h-5 shrink-0" />}
                        
                        <div className="space-y-2 w-full">
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
            </CardContent>
        </Card>
    );
}
