"use client";

import { useState } from 'react';
import { VideoCard } from './video-card';
import { PlaylistVideoModal } from './playlist-video-modal';
import { removeVideoFromPlaylist, addVideoToPlaylist } from '@/lib/actions/youtube';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { SavedVideo, SavedPlaylist } from '@/types/youtube';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ListPlus, Search, LayoutGrid, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface PlaylistContentProps {
    playlist: SavedPlaylist;
    videos: SavedVideo[];
    allPlaylists: SavedPlaylist[];
    libraryVideos: SavedVideo[];
}

export function PlaylistContent({ playlist, videos, allPlaylists, libraryVideos }: PlaylistContentProps) {
    const t = useTranslations('media.youtube.playlist');
    const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
    const [videoIdToRemove, setVideoIdToRemove] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingMode, setIsAddingMode] = useState(false);
    const router = useRouter();

    const handleRemove = async () => {
        if (!videoIdToRemove) return;
        try {
            await removeVideoFromPlaylist(videoIdToRemove, playlist.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to remove video from playlist', error);
        } finally {
            setVideoIdToRemove(null);
        }
    };

    const handleQuickAdd = async (videoId: string) => {
        try {
            await addVideoToPlaylist(videoId, playlist.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to add video to playlist', error);
        }
    };

    const existingIds = new Set(videos.map(v => v.id));
    const filteredLibrary = libraryVideos.filter(v =>
        !existingIds.has(v.id) &&
        (v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-red-500" />
                    <h2 className="text-xl font-bold text-white">{t('title')}</h2>
                    <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-500/20">
                        {t('itemsCount', { count: videos.length })}
                    </Badge>
                </div>
                <Button
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    variant={isAddingMode ? "destructive" : "outline"}
                    className="gap-2"
                >
                    {isAddingMode ? (
                        <>{t('cancel')}</>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            {t('addFromLibrary')}
                        </>
                    )}
                </Button>
            </div>

            {isAddingMode && (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <ListPlus className="w-5 h-5 text-red-500" />
                            {t('quickAdd')}
                        </div>
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder={t('searchLibrary')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 w-full"
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[300px] w-full pr-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredLibrary.map(v => (
                                <div key={v.id} className="group flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all">
                                    <div className="relative w-20 aspect-video rounded-lg overflow-hidden shrink-0">
                                        {v.thumbnail_url ? (
                                            <Image src={v.thumbnail_url} alt={v.title || "video"} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-sm font-medium text-white truncate group-hover:text-red-400 transition-colors">
                                            {v.title}
                                        </p>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleQuickAdd(v.id)}
                                        className="rounded-full hover:bg-red-600 hover:text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {filteredLibrary.length === 0 && (
                                <div className="col-span-full py-10 text-center text-gray-500 italic">
                                    {t('noMoreVideos')}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={setSelectedVideo}
                        onDelete={(id) => setVideoIdToRemove(id)}
                        onToggleFavorite={async (e) => {
                            // This is just a UI prop in VideoCard, toggle logic usually lives in gallery.
                        }}
                        playlists={allPlaylists}
                    />
                ))}
            </div>

            <PlaylistVideoModal
                isOpen={!!selectedVideo}
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
                playlistVideos={videos}
                onSelectVideo={setSelectedVideo}
            />

            <AlertDialog open={!!videoIdToRemove} onOpenChange={(open) => !open && setVideoIdToRemove(null)}>
                <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('removeTitle')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            {t('removeDesc', { title: playlist.title })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">
                            {t('cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove} className="bg-red-600 text-white hover:bg-red-700">
                            {t('remove')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
