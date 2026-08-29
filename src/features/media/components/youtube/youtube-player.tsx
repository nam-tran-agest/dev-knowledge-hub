'use client';

import { useEffect, useRef } from 'react';

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
            if (event.origin !== 'https://www.youtube.com') return;

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
                    '*'
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
                src={`https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1&enablejsapi=1&start=${Math.floor(startTime)}&rel=0&modestbranding=1`}
                title="YouTube Video Player"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
}

function extractCleanVideoId(urlOrId: string): string {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        return clean;
    }
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    if (match && match[1]) {
        return match[1];
    }
    const fallback = clean.match(/[\w-]{11}/);
    return fallback ? fallback[0] : clean;
}
