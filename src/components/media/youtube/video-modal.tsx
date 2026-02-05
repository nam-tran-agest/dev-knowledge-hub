'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, PictureInPicture2, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { usePipDraggable } from '@/hooks/use-pip-draggable';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/lib/actions/youtube';
import type { SavedVideo } from '@/types/youtube';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: SavedVideo | null;
}

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
    const playerRef = useRef<any>(null);
    const lastTimeRef = useRef(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const router = useRouter();

    // Extracted PiP Draggable Logic
    const { style: pipStyle, handleDragStart, position } = usePipDraggable(isPip);

    // Sync lastTimeRef when video changes (new video selected)
    useEffect(() => {
        if (video) {
            lastTimeRef.current = video.saved_time || 0;
        }
    }, [video?.id, video?.saved_time]);


    // Track playback time
    useEffect(() => {
        const interval = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                lastTimeRef.current = playerRef.current.getCurrentTime();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Load YouTube API
    useEffect(() => {
        if (!isOpen || !video) return;

        // Helper to init player
        const initPlayer = () => {
            // If container doesn't exist yet, wait (Dialog animation)
            const container = document.getElementById('youtube-player');
            if (!container) return;

            playerRef.current = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: getYouTubeId(video.url),
                playerVars: {
                    autoplay: 1,
                    start: Math.floor(lastTimeRef.current), // Start from tracked time
                },
            });
        };

        // Check if API is ready
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            // Destroy existing player if needed to prevent duplicates or state issues
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
            setTimeout(initPlayer, 100); // Small delay for Dialog to mount
        }

        return () => {
            // Cleanup on unmount (or PiP toggle if remounting)
            if (playerRef.current && playerRef.current.destroy) {
                // Ensure we save the specific last time before destroy if possible?
                // The interval handles it mostly.
                if (typeof playerRef.current.getCurrentTime === 'function') {
                    lastTimeRef.current = playerRef.current.getCurrentTime();
                }
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [isOpen, video, isPip]); // Re-run when PiP toggles to re-init properly if remounted

    const handleSaveProgress = async () => {
        if (!playerRef.current || !video) return;

        setIsSaving(true);
        try {
            const currentTime = playerRef.current.getCurrentTime();
            await updateVideoProgress(video.id, currentTime);
            router.refresh();
            onClose();
        } catch (error) {
            console.error('Failed to save progress', error);
        } finally {
            setIsSaving(false);
        }
    };


    if (!video) return null;

    // Helper to determine PiP classes
    // If not dragged yet (position is null), rely on bottom-6 right-6.
    // If dragged, use style (top/left) and remove bottom/right/auto constraints.
    const pipClasses = isPip
        ? `fixed w-[400px] shadow-2xl z-50 rounded-lg overflow-hidden border-gray-700 bg-black p-0 transition-all duration-300 pointer-events-auto group ${position
            ? '!translate-x-0 !translate-y-0' // Just override transforms
            : 'bottom-6 right-6 !translate-x-0 !translate-y-0 !top-auto !left-auto' // Force initial corner
        }`
        : "sm:max-w-4xl bg-black/95 border-gray-800 p-0 overflow-hidden flex flex-col transition-all duration-300 group";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={!isPip}>
            <DialogContent
                className={pipClasses}
                style={pipStyle}
                overlayClassName={isPip ? "bg-transparent pointer-events-none" : ""}
                onInteractOutside={(e) => {
                    // Prevent closing on interact outside when in PiP
                    if (isPip) e.preventDefault();
                }}
            >
                {/* Drag Handle Area - Header */}
                <DialogHeader
                    onMouseDown={handleDragStart}
                    className={`p-4 bg-background/10 backdrop-blur-sm absolute top-0 w-full z-10 flex flex-row items-center justify-between transition-opacity duration-300 cursor-move ${isPip ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                >
                    <div className='flex-1 pr-4 min-w-0'>
                        <DialogTitle className="text-white truncate flex items-center gap-2">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-red-400 hover:underline flex items-center gap-2 transition-colors truncate"
                            >
                                {video.title || 'YouTube Video'}
                                <ExternalLink className="w-4 h-4 shrink-0 opacity-50" />
                            </a>
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-xs mt-1">
                            Started at: {formatTime(video.saved_time)}
                        </DialogDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPip(!isPip)}
                            className="bg-black/50 hover:bg-black/80 text-white shrink-0 cursor-pointer rounded-full w-9 h-9"
                            title={isPip ? "Maximize" : "Mini Player"}
                        >
                            <PictureInPicture2 className="w-4 h-4" />
                        </Button>

                        {isPip && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="bg-black/50 hover:bg-red-600 hover:text-white text-white shrink-0 cursor-pointer rounded-full w-9 h-9 mr-2"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}

                        <Button
                            onClick={handleSaveProgress}
                            className="bg-red-600 hover:bg-red-700 text-white gap-2 shrink-0 cursor-pointer"
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save & Close'}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative w-full aspect-video bg-black mt-16 sm:mt-0">
                    <div id="youtube-player" className="w-full h-full" />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
