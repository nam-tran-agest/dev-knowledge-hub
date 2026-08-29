'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, ListVideo, Play, Terminal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/features/media/services/youtube';
import type { SavedVideo } from '@/features/media/types';
import { extractCleanVideoId, formatVideoTime } from '@/features/media/utils';
import { YouTubePlayer } from './youtube-player';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface PlaylistVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    video: SavedVideo | null;
    playlistVideos: SavedVideo[];
    onSelectVideo: (video: SavedVideo) => void;
}

export function PlaylistVideoModal({ isOpen, onClose, video, playlistVideos, onSelectVideo }: PlaylistVideoModalProps) {
    const lastTimeRef = useRef(0);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (video) {
            lastTimeRef.current = video.saved_time || 0;
        }
    }, [video]);

    // ESC to close
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

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-6xl bg-[#050714] border border-primary/50 cyber-clip-lg shadow-[0_0_50px_rgba(0,240,255,0.35)] overflow-hidden flex flex-col">
                {/* Background Grid Accent */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Corner Brackets */}
                <div className="absolute inset-0 cyber-brackets pointer-events-none" />

                {/* Header Deck */}
                <div className="relative z-10 p-3 sm:p-4 bg-[#050714]/95 backdrop-blur-md flex flex-row items-center justify-between border-b border-primary/25">
                    <div className="flex-1 pr-4 min-w-0">
                        <div className="text-white truncate flex items-center gap-2 font-mono text-xs sm:text-sm uppercase font-bold">
                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary flex items-center gap-1.5 transition-colors truncate"
                            >
                                <Terminal className="w-4 h-4 text-primary shrink-0" />
                                <span className="truncate">{video.title || 'YouTube Video'}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 hover:opacity-100" />
                            </a>
                        </div>
                        <div className="text-slate-400 font-mono text-[10px] mt-0.5 uppercase tracking-wider">
                            // STARTED AT: {formatVideoTime(video.saved_time)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content: Player + Queue */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 w-full overflow-hidden">
                    {/* Main Player Area */}
                    <div className="md:col-span-2 relative aspect-video bg-black shrink-0">
                        <YouTubePlayer
                            key={video.id}
                            videoId={cleanVideoId}
                            startTime={video.saved_time}
                            onTimeUpdate={(t) => { lastTimeRef.current = t; }}
                            onEnd={() => {
                                const currentIndex = playlistVideos.findIndex(v => v.id === video.id);
                                if (currentIndex !== -1 && currentIndex < playlistVideos.length - 1) {
                                    onSelectVideo(playlistVideos[currentIndex + 1]);
                                }
                            }}
                        />
                    </div>

                    {/* Sidebar Playlist Area */}
                    <div className="md:col-span-1 border-l border-primary/20 bg-[#04060f]/90 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-primary/20 flex items-center gap-2 bg-[#050714] shrink-0 font-mono text-xs">
                            <ListVideo className="w-3.5 h-3.5 text-primary" />
                            <span className="font-bold text-white uppercase tracking-wider">// QUEUE</span>
                            <span className="ml-auto text-[10px] text-primary/60">[ {playlistVideos.length} STREAMS ]</span>
                        </div>
                        <ScrollArea className="flex-1 p-2 h-[260px] md:max-h-[360px]">
                            <div className="space-y-1.5">
                                {playlistVideos.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => onSelectVideo(v)}
                                        className={`w-full flex gap-2.5 p-2 cyber-clip-button transition-all text-left group cursor-pointer ${
                                            v.id === video.id ? 'bg-primary/20 border border-primary/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'hover:bg-primary/5 border border-transparent hover:border-primary/20'
                                        }`}
                                    >
                                        <div className="relative w-20 aspect-video cyber-clip-sm overflow-hidden bg-black shrink-0">
                                            {v.thumbnail_url ? (
                                                <Image src={v.thumbnail_url} alt={v.title || "video"} fill className="object-cover opacity-80" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] text-primary/40 font-mono">NO FEED</div>
                                            )}
                                            {v.id === video.id && (
                                                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                                                    <Play className="w-3.5 h-3.5 text-black fill-black" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-0.5 font-mono">
                                            <p className={`text-xs font-bold line-clamp-2 transition-colors uppercase ${v.id === video.id ? 'text-primary' : 'text-slate-200 group-hover:text-white'}`}>
                                                {v.title}
                                            </p>
                                            {v.saved_time > 0 && (
                                                <p className="text-[9px] text-primary/50 mt-1 uppercase">// {formatVideoTime(v.saved_time)}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}
