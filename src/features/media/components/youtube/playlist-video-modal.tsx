'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, ExternalLink, ListVideo, Play } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateVideoProgress } from '@/features/media/services/youtube';
import type { SavedVideo } from '@/features/media/types';
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

    // Update lastTimeRef when video changes
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

    const modalClasses = `w-[100vw] sm:max-w-6xl bg-[#0a1224] bg-gradient-to-br from-[#0c1a36] via-[#0a1224] to-[#040816] border-gray-800 p-0 overflow-hidden flex flex-col transition-all duration-300 group`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={modalClasses}
                overlayClassName="bg-black/60 backdrop-blur-sm"
                hideCloseButton
            >
                <DialogHeader
                    className="p-3 sm:p-4 bg-white/5 backdrop-blur-md flex flex-row items-center justify-between relative opacity-100 border-b border-white/10"
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

                <div className="grid grid-cols-1 md:grid-cols-3 w-full overflow-hidden">
                    {/* Main Player Area */}
                    <div className="md:col-span-2 relative aspect-video bg-black shrink-0">
                        <YouTubePlayer
                            key={video.id}
                            videoId={getYouTubeId(video.url) || ''}
                            startTime={video.saved_time}
                            onTimeUpdate={(t) => lastTimeRef.current = t}
                            onEnd={() => {
                                const currentIndex = playlistVideos.findIndex(v => v.id === video.id);
                                if (currentIndex !== -1 && currentIndex < playlistVideos.length - 1) {
                                    onSelectVideo(playlistVideos[currentIndex + 1]);
                                }
                            }}
                        />
                    </div>

                    {/* Sidebar Playlist Area */}
                    <div className="md:col-span-1 border-l border-white/10 bg-slate-900/50 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-black/20 shrink-0">
                            <ListVideo className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-white">Up Next</span>
                            <span className="ml-auto text-xs text-gray-500">{playlistVideos.length} videos</span>
                        </div>
                        <ScrollArea className="flex-1 p-2 h-[300px] md:max-h-[380px]">
                            <div className="space-y-2">
                                {playlistVideos.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => onSelectVideo(v)}
                                        className={`w-full flex gap-3 p-2 rounded-lg transition-all text-left group ${v.id === video.id ? 'bg-red-600/20 border border-red-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="relative w-24 aspect-video rounded-md overflow-hidden bg-black shrink-0">
                                            {v.thumbnail_url ? (
                                                <Image src={v.thumbnail_url} alt={v.title || "video"} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                                            )}
                                            {v.id === video.id && (
                                                <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                                                    <Play className="w-4 h-4 text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <p className={`text-sm font-medium line-clamp-2 transition-colors ${v.id === video.id ? 'text-red-400' : 'text-gray-200 group-hover:text-white'}`}>
                                                {v.title}
                                            </p>
                                            {v.saved_time > 0 && (
                                                <p className="text-[10px] text-gray-500 mt-1">Resume at {formatTime(v.saved_time)}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
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
