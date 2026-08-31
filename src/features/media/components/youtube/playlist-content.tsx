"use client";

import { useState } from 'react';
import { VideoCard } from './video-card';
import { removeVideoFromPlaylist, addVideoToPlaylist } from '@/features/media/services/youtube';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { SavedVideo, SavedPlaylist } from '@/features/media/types';
import { useYouTubePlayerStore } from '@/features/media/store/useYouTubePlayerStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ListPlus, Search, LayoutGrid, Plus } from 'lucide-react';
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
                    <LayoutGrid className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">// {t('title')}</h2>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 font-mono text-[10px]">
                        [ {t('itemsCount', { count: videos.length })} ]
                    </Badge>
                </div>
                <Button
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    variant={isAddingMode ? "destructive" : "outline"}
                    className="gap-2 cyber-clip-button font-mono text-xs uppercase cursor-pointer"
                >
                    {isAddingMode ? (
                        <>[ {t('cancel')} ]</>
                    ) : (
                        <>
                            <Plus className="w-3.5 h-3.5" />
                            [ + {t('addFromLibrary')} ]
                        </>
                    )}
                </Button>
            </div>

            {isAddingMode && (
                <div className="bg-surface border border-primary/30 cyber-clip p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between gap-4 border-b border-primary/20 pb-3">
                        <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-bold">
                            <ListPlus className="w-4 h-4 text-primary" />
                            // {t('quickAdd')}
                        </div>
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/50" />
                            <Input
                                placeholder={t('searchLibrary')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-surface-deep/90 border-primary/30 w-full font-mono text-xs"
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[280px] w-full pr-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredLibrary.map(v => (
                                <div key={v.id} className="group flex items-center gap-3 p-2 cyber-clip-button bg-primary/[0.03] border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all font-mono">
                                    <div className="relative w-20 aspect-video cyber-clip-sm overflow-hidden bg-black shrink-0">
                                        {v.thumbnail_url ? (
                                            <Image src={v.thumbnail_url} alt={v.title || "video"} fill className="object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full bg-surface" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-xs font-bold text-slate-200 truncate group-hover:text-primary uppercase transition-colors">
                                            {v.title}
                                        </p>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleQuickAdd(v.id)}
                                        className="cyber-clip-button hover:bg-primary hover:text-black text-primary border border-primary/30 w-7 h-7 shrink-0 cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                            {filteredLibrary.length === 0 && (
                                <div className="col-span-full py-10 text-center text-primary/40 font-mono text-xs uppercase">
                                    // {t('noMoreVideos')}
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
                        onSelect={(v) => useYouTubePlayerStore.getState().playVideo(v, true)}
                        onDelete={(id) => setVideoIdToRemove(id)}
                        onToggleFavorite={async (e, v) => {
                            e.stopPropagation();
                            try {
                                const { toggleFavorite } = await import('@/features/media/services/youtube');
                                await toggleFavorite(v.id, !v.is_favorite);
                                router.refresh();
                            } catch (err) {
                                console.error('Failed to toggle favorite', err);
                            }
                        }}
                        playlists={allPlaylists}
                    />
                ))}
            </div>

            <AlertDialog open={!!videoIdToRemove} onOpenChange={(open) => !open && setVideoIdToRemove(null)}>
                <AlertDialogContent tag="REMOVE_FROM_PLAYLIST">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-mono font-bold uppercase tracking-wider text-destructive">
                            // {t('removeTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-primary/70 font-mono text-xs">
                            // {t('removeDesc', { title: playlist.title })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="font-mono text-xs uppercase">
                            [ {t('cancel')} ]
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90 text-white font-mono text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                            [ {t('remove')} ]
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
