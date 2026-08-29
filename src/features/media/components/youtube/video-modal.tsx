'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, PictureInPicture2, X, Terminal } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePipDraggable } from '@/hooks/use-pip-draggable';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/features/media/services/youtube';
import type { SavedVideo } from '@/features/media/types';
import { YouTubePlayer } from './youtube-player';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: SavedVideo | null;
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
    const t = useTranslations('media.youtube.modal');
    const lastTimeRef = useRef(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const router = useRouter();

    const { style: pipStyle, handleDragStart, position } = usePipDraggable(isPip);

    useEffect(() => {
        if (video) {
            lastTimeRef.current = video.saved_time || 0;
        }
    }, [video]);

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
        ? `fixed w-[90vw] sm:w-[420px] shadow-[0_0_30px_rgba(0,240,255,0.3)] z-50 cyber-clip overflow-hidden border border-primary/50 bg-[#04060f] p-0 transition-all duration-300 pointer-events-auto group ${position
            ? '!translate-x-0 !translate-y-0'
            : 'bottom-6 right-6 !translate-x-0 !translate-y-0 !top-auto !left-auto'
        }`
        : "w-[100vw] sm:max-w-4xl p-0 overflow-hidden flex flex-col transition-all duration-300 group cyber-clip-lg border border-primary/40 bg-[#050714]";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={!isPip}>
            <DialogContent
                className={pipClasses}
                style={pipStyle}
                overlayClassName="bg-[#04060f]/80 backdrop-blur-md"
                onInteractOutside={(e) => {
                    if (isPip) e.preventDefault();
                }}
                tag="STREAM_RENDERER"
                hideCloseButton
            >
                <DialogHeader
                    onMouseDown={handleDragStart}
                    className={`p-3 sm:p-4 bg-[#050714]/90 backdrop-blur-md flex flex-row items-center justify-between transition-opacity duration-300 ${isPip ? 'cursor-move absolute top-0 w-full z-10 opacity-0 group-hover:opacity-100' : 'relative opacity-100 border-b border-primary/20'}`}
                >
                    <div className='flex-1 pr-4 min-w-0'>
                        <DialogTitle className="text-white truncate flex items-center gap-2 font-mono text-sm uppercase">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary flex items-center gap-1.5 transition-colors truncate"
                            >
                                <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
                                {video.title || t('defaultTitle')}
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50" />
                            </a>
                        </DialogTitle>
                        <DialogDescription className="text-primary/60 font-mono text-[10px] mt-0.5 uppercase tracking-wider">
                            // {t('startedAt', { time: formatTime(video.saved_time) })}
                        </DialogDescription>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPip(!isPip)}
                            className="bg-black/60 hover:bg-primary/20 text-primary shrink-0 cursor-pointer cyber-clip-button w-8 h-8 border border-primary/30"
                            title={isPip ? t('maximize') : t('miniPlayer')}
                        >
                            <PictureInPicture2 className="w-3.5 h-3.5" />
                        </Button>

                        {isPip && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="bg-black/60 hover:bg-destructive text-white shrink-0 cursor-pointer cyber-clip-button w-8 h-8 border border-destructive/40"
                                title={t('close')}
                            >
                                <X className="w-3.5 h-3.5" />
                            </Button>
                        )}

                        <Button
                            onClick={handleSaveProgress}
                            size="sm"
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider gap-1.5 cursor-pointer h-8 px-3 cyber-clip-button shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90 text-xs"
                            disabled={isSaving}
                        >
                            <Save className="w-3.5 h-3.5" />
                            {isSaving ? '[ SAVING... ]' : '[ SAVE & EXIT ]'}
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
