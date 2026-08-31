'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';

import { Plus, Clock, ListVideo, Heart } from 'lucide-react';
import { VideoModal } from './video-modal';
import { VideoCard } from './video-card';
import { PlaylistCard } from './playlist-card';
import { CreatePlaylistDialog } from './create-playlist-dialog';
import { EditPlaylistDialog } from './edit-playlist-dialog';
import { AddToPlaylistDialog } from './add-to-playlist-dialog';
import { YouTubeSearchBar } from './youtube-search-bar';
import { YouTubeEmptyState } from './youtube-empty-state';
import { YouTubeDeleteDialog } from './youtube-delete-dialog';
import type { SavedVideo, SavedPlaylist } from '@/features/media/types';
import { addVideo, deleteVideo, toggleFavorite, deletePlaylist, togglePlaylistFavorite } from '@/features/media/services/youtube';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isToday, isYesterday } from 'date-fns';

interface YouTubeGalleryProps {
    videos: SavedVideo[];
    playlists: SavedPlaylist[];
}

export function YouTubeGallery({ videos, playlists }: YouTubeGalleryProps) {
    const t = useTranslations('media.youtube');
    const format = useFormatter();
    const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
    const [videoIdToAdd, setVideoIdToAdd] = useState<string | null>(null);
    const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
    const [playlistToEdit, setPlaylistToEdit] = useState<SavedPlaylist | null>(null);
    const [url, setUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const favoriteVideos = videos.filter(v => v.is_favorite);
    const favoritePlaylists = playlists.filter(p => p.is_favorite);

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsAdding(true);
        try {
            const formData = new FormData();
            formData.append('url', url);
            await addVideo(formData);
            router.refresh();
            setUrl('');
        } catch (error) {
            console.error('Failed to add video', error);
        } finally {
            setIsAdding(false);
        }
    };

    const confirmDelete = async () => {
        try {
            if (videoToDelete) {
                await deleteVideo(videoToDelete);
            } else if (playlistToDelete) {
                await deletePlaylist(playlistToDelete);
            }
            router.refresh();
        } catch (error) {
            console.error('Failed to delete', error);
        } finally {
            setVideoToDelete(null);
            setPlaylistToDelete(null);
        }
    };

    const handleToggleVideoFavorite = async (e: React.MouseEvent, video: SavedVideo) => {
        e.stopPropagation();
        try {
            await toggleFavorite(video.id, !video.is_favorite);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const handleTogglePlaylistFavorite = async (e: React.MouseEvent, playlist: SavedPlaylist) => {
        e.stopPropagation();
        try {
            await togglePlaylistFavorite(playlist.id, !playlist.is_favorite);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const renderVideos = (list: SavedVideo[], emptyText: string) => {
        if (list.length === 0) {
            return (
                <YouTubeEmptyState
                    title={t('gallery.noVideosFound')}
                    description={emptyText}
                    type="videos"
                />
            );
        }

        const groups = list.reduce((acc, video) => {
            const date = new Date(video.updated_at || video.created_at);
            let key = format.dateTime(date, { year: 'numeric', month: 'long', day: 'numeric' });
            if (isToday(date)) key = t('gallery.today');
            else if (isYesterday(date)) key = t('gallery.yesterday');

            if (!acc[key]) acc[key] = [];
            acc[key].push(video);
            return acc;
        }, {} as Record<string, SavedVideo[]>);

        return (
            <div className="space-y-10">
                {Object.keys(groups).map((dateKey) => (
                    <div key={dateKey} className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                            <span className="w-1.5 h-4 bg-primary" />
                            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">// {dateKey}</h2>
                            <span className="text-[10px] font-mono text-primary/60 ml-auto">[ {groups[dateKey].length} STREAMS ]</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groups[dateKey].map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onSelect={setSelectedVideo}
                                    onDelete={(id) => setVideoToDelete(id)}
                                    onToggleFavorite={handleToggleVideoFavorite}
                                    playlists={playlists}
                                    onAddToPlaylist={(id: string) => setVideoIdToAdd(id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-20">
            <YouTubeSearchBar
                url={url}
                setUrl={setUrl}
                onSubmit={handleAddVideo}
                isAdding={isAdding}
                placeholder={t('gallery.searchPlaceholder')}
                buttonLabel={t('actions.addVideo')}
                addingLabel={t('actions.adding')}
            />

            <Tabs defaultValue="recent" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                    <TabsList className="p-1 h-auto grid grid-cols-3 sm:flex w-full sm:w-auto">
                        <TabsTrigger value="recent" className="px-3 sm:px-5 py-2 cyber-clip-button text-xs font-mono uppercase tracking-wider gap-2">
                            <Clock className="w-3.5 h-3.5 hidden xs:block" />
                            [ 01-{t('tabs.recent')} ]
                        </TabsTrigger>
                        <TabsTrigger value="playlists" className="px-3 sm:px-5 py-2 cyber-clip-button text-xs font-mono uppercase tracking-wider gap-2">
                            <ListVideo className="w-3.5 h-3.5 hidden xs:block" />
                            [ 02-{t('tabs.playlists')} ]
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="px-3 sm:px-5 py-2 cyber-clip-button text-xs font-mono uppercase tracking-wider gap-2">
                            <Heart className="w-3.5 h-3.5 hidden xs:block" />
                            [ 03-{t('tabs.favorites')} ]
                        </TabsTrigger>
                    </TabsList>

                    <Button
                        onClick={() => setIsCreatePlaylistOpen(true)}
                        variant="outline"
                        className="bg-primary/10 border-primary/40 hover:bg-primary/20 text-primary gap-2 h-10 px-5 cyber-clip-button transition-all w-full sm:w-auto cursor-pointer font-mono text-xs uppercase tracking-wider"
                    >
                        <Plus className="w-4 h-4" />
                        [ + {t('actions.createPlaylist')} ]
                    </Button>
                </div>

                <TabsContent value="recent" className="mt-0">
                    {renderVideos(videos, t('gallery.emptyRecent'))}
                </TabsContent>

                <TabsContent value="playlists" className="mt-0 space-y-12">
                    {favoritePlaylists.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                                    // {t('gallery.favoritePlaylists')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favoritePlaylists.map((playlist) => (
                                    <PlaylistCard
                                        key={playlist.id}
                                        playlist={playlist}
                                        onDelete={(id) => setPlaylistToDelete(id)}
                                        onToggleFavorite={handleTogglePlaylistFavorite}
                                        onEdit={setPlaylistToEdit}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onDelete={(id) => setPlaylistToDelete(id)}
                                onToggleFavorite={handleTogglePlaylistFavorite}
                                onEdit={setPlaylistToEdit}
                            />
                        ))}
                        {playlists.length === 0 && (
                            <YouTubeEmptyState
                                title={t('gallery.noPlaylists')}
                                description={t('gallery.noPlaylistsDesc')}
                                actionLabel={t('gallery.createFirst')}
                                onAction={() => setIsCreatePlaylistOpen(true)}
                                type="playlists"
                            />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0 space-y-12">
                    {renderVideos(favoriteVideos, t('gallery.emptyFavorites'))}

                    {favoritePlaylists.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">// {t('gallery.favoritePlaylists')}</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favoritePlaylists.map((playlist) => (
                                    <PlaylistCard
                                        key={playlist.id}
                                        playlist={playlist}
                                        onDelete={(id) => setPlaylistToDelete(id)}
                                        onToggleFavorite={handleTogglePlaylistFavorite}
                                        onEdit={setPlaylistToEdit}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                video={selectedVideo}
            />

            <YouTubeDeleteDialog
                isOpen={!!videoToDelete || !!playlistToDelete}
                onClose={() => { setVideoToDelete(null); setPlaylistToDelete(null); }}
                onConfirm={confirmDelete}
                title={t('gallery.confirmDeleteTitle')}
                description={t('gallery.confirmDeleteDesc')}
                cancelLabel={t('actions.cancel')}
                deleteLabel={t('gallery.delete')}
            />

            <CreatePlaylistDialog
                open={isCreatePlaylistOpen}
                onOpenChange={setIsCreatePlaylistOpen}
            />
            <EditPlaylistDialog
                open={!!playlistToEdit}
                onOpenChange={(open) => !open && setPlaylistToEdit(null)}
                playlist={playlistToEdit}
            />
            <AddToPlaylistDialog
                videoId={videoIdToAdd}
                playlists={playlists}
                onClose={() => setVideoIdToAdd(null)}
            />
        </div>
    );
}
