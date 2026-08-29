'use client';

import { useEffect, useRef, useState } from 'react';

// Define YouTube types locally
declare global {
    interface Window {
        YT: {
            Player: {
                new(id: string, config: Record<string, unknown>): {
                    destroy: () => void;
                    getCurrentTime: () => number;
                };
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
    const playerRef = useRef<{
        destroy: () => void;
        getCurrentTime: () => number;
    } | null>(null);
    const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
    const [useFallbackIframe, setUseFallbackIframe] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) {
                // Fallback to direct iframe if API fails to load after 2.5s
                timeout = setTimeout(() => {
                    if (!playerRef.current) {
                        setUseFallbackIframe(true);
                    }
                }, 2500);
                return;
            }

            if (playerRef.current) {
                playerRef.current.destroy();
            }

            try {
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
                        onStateChange: (event: { data: number }) => {
                            if (event.data === 0 && onEnd) {
                                onEnd();
                            }
                        }
                    }
                });
            } catch (err) {
                console.warn('Failed to initialize YT Player, falling back to iframe', err);
                setUseFallbackIframe(true);
            }
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
            timeout = setTimeout(() => {
                if (!window.YT) setUseFallbackIframe(true);
            }, 3000);
        } else {
            initPlayer();
        }

        return () => {
            if (interval) clearInterval(interval);
            if (timeout) clearTimeout(timeout);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [videoId, onEnd, onTimeUpdate, startTime]);

    return (
        <div className={`aspect-video w-full bg-black relative overflow-hidden ${className}`}>
            {useFallbackIframe ? (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&start=${Math.floor(startTime)}&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <div id={containerId.current} className="w-full h-full" />
            )}
        </div>
    );
}
