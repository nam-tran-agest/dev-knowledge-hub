'use client';

import { useEffect, useRef } from 'react';
import { extractCleanVideoId, getYoutubeEmbedUrl } from '@/features/media/utils/youtube';

interface YouTubePlayerProps {
    videoId: string;
    onTimeUpdate?: (time: number) => void;
    onEnd?: () => void;
    startTime?: number;
    className?: string;
}

export function YouTubePlayer({ videoId, onTimeUpdate, onEnd, startTime = 0, className = "" }: YouTubePlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Clean videoId
    const cleanId = extractCleanVideoId(videoId);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://www.youtube.com' && event.origin !== 'https://www.youtube-nocookie.com') return;

            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data.event === 'onStateChange' && data.info === 0 && onEnd) {
                    onEnd();
                }
                if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
                    if (onTimeUpdate) {
                        onTimeUpdate(data.info.currentTime);
                    }
                }
            } catch {
                // Ignore parse errors from non-json messages
            }
        };

        window.addEventListener('message', handleMessage);

        // Periodically request time from player via postMessage
        const interval = setInterval(() => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: 'listening', id: cleanId }),
                    'https://www.youtube-nocookie.com'
                );
            }
        }, 1000);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearInterval(interval);
        };
    }, [cleanId, onEnd, onTimeUpdate]);

    if (!cleanId) {
        return (
            <div className="aspect-video w-full bg-[#04060f] flex items-center justify-center font-mono text-xs text-primary/60 uppercase">
                // INVALID_VIDEO_ID_STREAM
            </div>
        );
    }

    return (
        <div className={`relative aspect-video w-full bg-black overflow-hidden ${className}`}>
            <iframe
                ref={iframeRef}
                src={getYoutubeEmbedUrl(cleanId, startTime)}
                title="YouTube Video Player"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
}
