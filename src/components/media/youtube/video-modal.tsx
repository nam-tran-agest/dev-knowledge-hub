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
import { useRef, useState, useEffect } from 'react';
import { usePipDraggable } from '@/hooks/use-pip-draggable';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/lib/actions/youtube';
import type { SavedVideo } from '@/types/youtube';
import { YouTubePlayer } from './youtube-player';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: SavedVideo | null;
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
    const lastTimeRef = useRef(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const router = useRouter();

    const { style: pipStyle, handleDragStart, position } = usePipDraggable(isPip);

    // Update lastTimeRef when video changes
    useEffect(() => {
        if (video) {
            lastTimeRef.current = video.saved_time || 0;
        }
    }, [video?.id]);

    const handleSaveProgress = async () => {
        if (!video) return;

        setIsSaving(true);
        try {
            await updateVideoProgress(video.id, lastTimeRef.current);
            router.refresh();
            onClose();
        } catch (error) {
            console.error('Failed to save progress', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!video) return null;

    const pipClasses = isPip
        ? `fixed w-[400px] shadow-2xl z-50 rounded-lg overflow-hidden border-gray-700 bg-black p-0 transition-all duration-300 pointer-events-auto group ${position
            ? '!translate-x-0 !translate-y-0'
            : 'bottom-6 right-6 !translate-x-0 !translate-y-0 !top-auto !left-auto'
        }`
        : "sm:max-w-4xl bg-[#0a1224] bg-gradient-to-br from-[#0c1a36] via-[#0a1224] to-[#040816] border-gray-800 p-0 overflow-hidden flex flex-col transition-all duration-300 group";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={!isPip}>
            <DialogContent
                className={pipClasses}
                style={pipStyle}
                overlayClassName="bg-black/60 backdrop-blur-sm"
                onInteractOutside={(e) => {
                    if (isPip) e.preventDefault();
                }}
                hideCloseButton
            >
                <DialogHeader
                    onMouseDown={handleDragStart}
                    className={`p-4 bg-white/5 backdrop-blur-md flex flex-row items-center justify-between transition-opacity duration-300 ${isPip ? 'cursor-move absolute top-0 w-full z-10 opacity-0 group-hover:opacity-100' : 'relative opacity-100 border-b border-white/10'}`}
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
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer h-9 px-4"
                            disabled={isSaving}
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save & Close'}
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative w-full aspect-video bg-black">
                    <YouTubePlayer
                        key={video.id}
                        videoId={getYouTubeId(video.url) || ''}
                        startTime={video.saved_time}
                        onTimeUpdate={(t) => lastTimeRef.current = t}
                    />
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
