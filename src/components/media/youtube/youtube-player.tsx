'use client';

import { useEffect, useRef } from 'react';

// Define YouTube types locally to avoid lint errors if global types are missing
declare global {
    interface Window {
        YT: {
            Player: {
                new(id: string, config: any): any;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YouTubePlayerProps {
    videoId: string;
    onTimeUpdate?: (time: number) => void;
    onEnd?: () => void;
    startTime?: number;
    className?: string;
}

export function YouTubePlayer({ videoId, onTimeUpdate, onEnd, startTime = 0, className = "" }: YouTubePlayerProps) {
    const playerRef = useRef<Record<string, any> | null>(null);
    const containerId = useRef(`yt-player-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) return;

            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player(containerId.current, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    start: Math.floor(startTime),
                    modestbranding: 1,
                    rel: 0,
                    enablejsapi: 1,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                },
                events: {
                    onReady: () => {
                        if (onTimeUpdate) {
                            interval = setInterval(() => {
                                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                                    onTimeUpdate(playerRef.current.getCurrentTime());
                                }
                            }, 1000);
                        }
                    },
                    onStateChange: (event: any) => {
                        if (event.data === 0 && onEnd) { // 0 is Ended
                            onEnd();
                        }
                    }
                }
            });
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }

        return () => {
            if (interval) clearInterval(interval);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoId, onEnd, onTimeUpdate, startTime]); // Re-init correctly

    return (
        <div className={`aspect-video w-full bg-black rounded-lg overflow-hidden ${className}`}>
            <div id={containerId.current} className="w-full h-full" />
        </div>
    );
}
