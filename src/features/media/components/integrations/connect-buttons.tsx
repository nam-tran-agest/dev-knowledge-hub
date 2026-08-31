'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConnectButtonsProps {
    isConnectedSpotify?: boolean;
    isConnectedSteam?: boolean;
}

export function ConnectButtons({ isConnectedSpotify = false, isConnectedSteam = false }: ConnectButtonsProps) {
    const router = useRouter();

    return (
        <Card className="border-primary/20">
            <CardContent className="flex flex-wrap gap-4 p-4 pt-4">
                <h3 className="w-full text-sm font-mono text-primary/70 uppercase mb-2">
                    // EXTERNAL_INTEGRATIONS
                </h3>
                
                <Button 
                    variant={isConnectedSpotify ? "outline" : "default"}
                    className={isConnectedSpotify ? "border-emerald-500/50 text-emerald-400" : "bg-emerald-600 hover:bg-emerald-500 text-white"}
                    onClick={() => router.push('/api/auth/spotify')}
                    disabled={isConnectedSpotify}
                >
                    <Music className="w-4 h-4 mr-2" />
                    {isConnectedSpotify ? "Spotify Connected" : "Connect Spotify"}
                </Button>

                <Button 
                    variant={isConnectedSteam ? "outline" : "default"}
                    className={isConnectedSteam ? "border-blue-500/50 text-blue-400" : "bg-blue-600 hover:bg-blue-500 text-white"}
                    onClick={() => router.push('/api/auth/steam')}
                    disabled={isConnectedSteam}
                >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    {isConnectedSteam ? "Steam Connected" : "Connect Steam"}
                </Button>
            </CardContent>
        </Card>
    );
}
