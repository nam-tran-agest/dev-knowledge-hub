'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, PictureInPicture2, X, Terminal, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePipDraggable } from '@/hooks/use-pip-draggable';
import { useYouTubePlayerStore } from '@/features/media/store/useYouTubePlayerStore';
import { extractCleanVideoId, formatVideoTime } from '@/features/media/utils';
import { YouTubePlayer } from './youtube-player';

export function GlobalYouTubePlayer() {
    const t = useTranslations('media.youtube.modal');
    const [isSaving, setIsSaving] = useState(false);

    const activeVideo = useYouTubePlayerStore(state => state.activeVideo);
    const isModalOpen = useYouTubePlayerStore(state => state.isModalOpen);
    const isPip = useYouTubePlayerStore(state => state.isPip);
    const openModal = useYouTubePlayerStore(state => state.openModal);
    const setPip = useYouTubePlayerStore(state => state.setPip);
    const closePlayer = useYouTubePlayerStore(state => state.closePlayer);
    const setCurrentTime = useYouTubePlayerStore(state => state.setCurrentTime);
    const saveProgress = useYouTubePlayerStore(state => state.saveProgress);

    const { style: pipStyle, handleDragStart, position } = usePipDraggable(isPip);

    if (!activeVideo) return null;

    const cleanVideoId = extractCleanVideoId(activeVideo.url);

    const handleSaveProgress = async () => {
        setIsSaving(true);
        try {
            await saveProgress();
            closePlayer();
        } catch (error: unknown) {
            console.error('Failed to save progress:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Render PiP Floating Player (Persistent across all routes)
    if (isPip && !isModalOpen) {
        return (
            <div
                style={pipStyle}
                className={`fixed z-[99999] w-[90vw] sm:w-[420px] shadow-[0_0_35px_rgba(0,240,255,0.5)] cyber-clip overflow-hidden border border-primary/70 bg-[#04060f] p-0 transition-all duration-200 group ${
                    position ? '' : 'bottom-6 right-6'
                }`}
            >
                {/* Drag Header on Hover */}
                <div
                    onMouseDown={handleDragStart}
                    className="cursor-move absolute top-0 left-0 right-0 z-30 opacity-0 group-hover:opacity-100 bg-black/90 p-2 flex items-center justify-between border-b border-primary/30 transition-opacity backdrop-blur-md"
                >
                    <span className="text-white text-xs font-mono truncate max-w-[200px] font-bold">
                        {activeVideo.title || t('defaultTitle')}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={openModal}
                            className="w-7 h-7 cyber-clip-button bg-primary/20 text-primary border border-primary/40 cursor-pointer hover:bg-primary hover:text-black"
                            title={t('maximize')}
                        >
                            <Maximize2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={closePlayer}
                            className="w-7 h-7 cyber-clip-button bg-destructive/80 text-white border border-destructive/50 cursor-pointer hover:bg-destructive"
                            title={t('close')}
                        >
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="relative w-full aspect-video bg-black">
                    <YouTubePlayer
                        key={activeVideo.id}
                        videoId={cleanVideoId}
                        startTime={activeVideo.saved_time}
                        onTimeUpdate={(t) => setCurrentTime(t)}
                    />
                </div>
            </div>
        );
    }

    // Render Full Centered Modal View
    if (isModalOpen) {
        return (
            <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-200"
                onClick={(e) => {
                    if (e.target === e.currentTarget) setPip(true);
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
                                    href={activeVideo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary flex items-center gap-1.5 transition-colors truncate"
                                >
                                    <Terminal className="w-4 h-4 text-primary shrink-0" />
                                    <span className="truncate">{activeVideo.title || t('defaultTitle')}</span>
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 hover:opacity-100" />
                                </a>
                            </div>
                            <div className="text-slate-400 font-mono text-[10px] mt-0.5 uppercase tracking-wider">
                                // {t('startedAt', { time: formatVideoTime(activeVideo.saved_time) })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPip(true)}
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
                                onClick={closePlayer}
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
                            key={activeVideo.id}
                            videoId={cleanVideoId}
                            startTime={activeVideo.saved_time}
                            onTimeUpdate={(t) => setCurrentTime(t)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
