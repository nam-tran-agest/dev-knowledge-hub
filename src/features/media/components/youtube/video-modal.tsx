'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, PictureInPicture2, X, Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePipDraggable } from '@/hooks/use-pip-draggable';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/features/media/services/youtube';
import type { SavedVideo } from '@/features/media/types';
import { extractCleanVideoId, formatVideoTime } from '@/features/media/utils';
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

    // Handle ESC key to close
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSaveProgress = useCallback(async () => {
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
    }, [video, router, onClose]);

    if (!isOpen || !video) return null;

    const cleanVideoId = extractCleanVideoId(video.url);

    // Render PiP Mode
    if (isPip) {
        return (
            <div
                style={pipStyle}
                className={`fixed z-[9999] w-[90vw] sm:w-[420px] shadow-[0_0_35px_rgba(0,240,255,0.5)] cyber-clip overflow-hidden border border-primary/60 bg-[#04060f] p-0 transition-all duration-200 group ${
                    position ? '' : 'bottom-6 right-6'
                }`}
            >
                {/* Drag Header on Hover */}
                <div
                    onMouseDown={handleDragStart}
                    className="cursor-move absolute top-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 bg-black/90 p-2 flex items-center justify-between border-b border-primary/30 transition-opacity"
                >
                    <span className="text-white text-xs font-mono truncate max-w-[200px] font-bold">
                        {video.title || t('defaultTitle')}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPip(false)}
                            className="w-7 h-7 cyber-clip-button bg-primary/20 text-primary border border-primary/40 cursor-pointer"
                            title={t('maximize')}
                        >
                            <PictureInPicture2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="w-7 h-7 cyber-clip-button bg-destructive/80 text-white border border-destructive/50 cursor-pointer"
                            title={t('close')}
                        >
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="relative w-full aspect-video bg-black">
                    <YouTubePlayer
                        key={video.id}
                        videoId={cleanVideoId}
                        startTime={video.saved_time}
                        onTimeUpdate={(t) => { lastTimeRef.current = t; }}
                    />
                </div>
            </div>
        );
    }

    // Render Standard Centered Modal
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-4xl bg-surface border border-primary/50 cyber-clip-lg shadow-[0_0_50px_rgba(0,240,255,0.35)] overflow-hidden flex flex-col">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Corner Brackets */}
                <div className="absolute inset-0 cyber-brackets pointer-events-none" />

                {/* Header Deck */}
                <div className="relative z-10 p-3 sm:p-4 bg-surface/95 backdrop-blur-md flex flex-row items-center justify-between border-b border-primary/25">
                    <div className="flex-1 pr-4 min-w-0">
                        <div className="text-white truncate flex items-center gap-2 font-mono text-xs sm:text-sm uppercase font-bold">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary flex items-center gap-1.5 transition-colors truncate"
                            >
                                <Terminal className="w-4 h-4 text-primary shrink-0" />
                                <span className="truncate">{video.title || t('defaultTitle')}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 hover:opacity-100" />
                            </a>
                        </div>
                        <div className="text-slate-400 font-mono text-[10px] mt-0.5 uppercase tracking-wider">
                            // {t('startedAt', { time: formatVideoTime(video.saved_time) })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPip(true)}
                            className="bg-black/80 hover:bg-primary/20 text-primary shrink-0 cursor-pointer cyber-clip-button w-8 h-8 border border-primary/30"
                            title={t('miniPlayer')}
                        >
                            <PictureInPicture2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                            onClick={handleSaveProgress}
                            size="sm"
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider gap-1.5 cursor-pointer h-8 px-3.5 cyber-clip-button shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90 text-xs"
                            disabled={isSaving}
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">{isSaving ? '[ SAVING... ]' : '[ SAVE & EXIT ]'}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="bg-black/80 hover:bg-destructive text-white hover:text-white shrink-0 cursor-pointer cyber-clip-button w-8 h-8 border border-destructive/40"
                            title={t('close')}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Video Area */}
                <div className="relative z-10 w-full aspect-video bg-black">
                    <YouTubePlayer
                        key={video.id}
                        videoId={cleanVideoId}
                        startTime={video.saved_time}
                        onTimeUpdate={(t) => { lastTimeRef.current = t; }}
                    />
                </div>
            </div>
        </div>
    );
}
