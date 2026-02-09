'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useFormatter } from 'next-intl';

import { PlayCircle, Plus, Clock, ListVideo, Heart } from 'lucide-react';
import { VideoModal } from './video-modal';
import { VideoCard } from './video-card';
import { PlaylistCard } from './playlist-card';
import { CreatePlaylistDialog } from './create-playlist-dialog';
import { EditPlaylistDialog } from './edit-playlist-dialog';
import { AddToPlaylistDialog } from './add-to-playlist-dialog';
import type { SavedVideo, SavedPlaylist } from '@/types/youtube';
import { addVideo, deleteVideo, toggleFavorite, deletePlaylist, togglePlaylistFavorite } from '@/lib/actions/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isToday, isYesterday } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
                <Card className="text-center py-20 bg-slate-900/30 border-white/10 backdrop-blur-sm">
                    <CardContent>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                            <PlayCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-white">{t('gallery.noVideosFound')}</h3>
                        <p className="text-gray-400">{emptyText}</p>
                    </CardContent>
                </Card>
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
                        <h2 className="text-xl font-bold text-white border-l-4 border-red-500 pl-3">{dateKey}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groups[dateKey].map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onSelect={setSelectedVideo}
                                    onDelete={(id) => setVideoToDelete(id)}
                                    onToggleFavorite={handleToggleVideoFavorite}
                                    playlists={playlists}
                                    onAddToPlaylist={(id) => setVideoIdToAdd(id)}
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
            <div className="bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
                <form onSubmit={handleAddVideo} className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder={t('gallery.searchPlaceholder')}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus:ring-red-500/50 h-12 text-base sm:text-lg w-full"
                        disabled={isAdding}
                    />
                    <Button
                        type="submit"
                        disabled={isAdding || !url}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 h-12 text-base sm:text-lg font-semibold transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto shrink-0"
                    >
                        {isAdding ? t('actions.adding') : t('actions.addVideo')}
                    </Button>
                </form>
            </div>

            <Tabs defaultValue="recent" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
                    <TabsList className="bg-slate-900/50 border border-white/10 p-1 h-auto grid grid-cols-3 sm:flex w-full sm:w-auto">
                        <TabsTrigger value="recent" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-2 sm:px-6 py-2.5 rounded-lg transition-all text-sm sm:text-base gap-2">
                            <Clock className="w-4 h-4 hidden xs:block" />
                            {t('tabs.recent')}
                        </TabsTrigger>
                        <TabsTrigger value="playlists" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-2 sm:px-6 py-2.5 rounded-lg transition-all text-sm sm:text-base gap-2">
                            <ListVideo className="w-4 h-4 hidden xs:block" />
                            {t('tabs.playlists')}
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-2 sm:px-6 py-2.5 rounded-lg transition-all text-sm sm:text-base gap-2">
                            <Heart className="w-4 h-4 hidden xs:block" />
                            {t('tabs.favorites')}
                        </TabsTrigger>
                    </TabsList>

                    <Button
                        onClick={() => setIsCreatePlaylistOpen(true)}
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-xl transition-all w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        {t('actions.createPlaylist')}
                    </Button>
                </div>

                <TabsContent value="recent" className="mt-0">
                    {renderVideos(videos, t('gallery.emptyRecent'))}
                </TabsContent>

                <TabsContent value="playlists" className="mt-0 space-y-12">
                    {favoritePlaylists.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                {t('gallery.favoritePlaylists')}
                            </h2>
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
                            <div className="col-span-full py-20 text-center bg-slate-900/30 border border-dashed border-white/10 rounded-2xl space-y-4">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ListVideo className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-400">{t('gallery.noPlaylists')}</h3>
                                <p className="text-gray-500">{t('gallery.noPlaylistsDesc')}</p>
                                <Button
                                    onClick={() => setIsCreatePlaylistOpen(true)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {t('gallery.createFirst')}
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0 space-y-12">
                    {renderVideos(favoriteVideos, t('gallery.emptyFavorites'))}

                    {favoritePlaylists.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white border-l-4 border-red-500 pl-3">{t('gallery.favoritePlaylists')}</h2>
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

            <AlertDialog open={!!videoToDelete || !!playlistToDelete} onOpenChange={(open) => !open && (setVideoToDelete(null), setPlaylistToDelete(null))}>
                <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('gallery.confirmDeleteTitle')}</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            {t('gallery.confirmDeleteDesc')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">{t('actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">{t('gallery.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
