'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PlayCircle, Plus, Clock } from 'lucide-react';
import { VideoModal } from './video-modal';
import { VideoCard } from './video-card';
import type { SavedVideo } from '@/types/youtube';
import { addVideo, deleteVideo, toggleFavorite } from '@/lib/actions/youtube';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isToday, isYesterday } from 'date-fns';
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
}

export function YouTubeGallery({ videos }: YouTubeGalleryProps) {
    const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
    const [url, setUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

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
            alert('Invalid YouTube URL or Error saving to database');
        } finally {
            setIsAdding(false);
        }
    };

    const confirmDelete = async () => {
        if (!videoToDelete) return;
        try {
            await deleteVideo(videoToDelete);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete', error);
        } finally {
            setVideoToDelete(null);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, video: SavedVideo) => {
        e.stopPropagation();
        try {
            await toggleFavorite(video.id, !video.is_favorite);
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
                        <h3 className="text-xl font-semibold mb-2 text-white">No videos found</h3>
                        <p className="text-gray-400">{emptyText}</p>
                    </CardContent>
                </Card>
            );
        }

        const groups = list.reduce((acc, video) => {
            const date = new Date(video.updated_at || video.created_at);
            let key = format(date, 'yyyy-MM-dd');
            if (isToday(date)) key = 'Today';
            else if (isYesterday(date)) key = 'Yesterday';
            else key = format(date, 'MMMM d, yyyy');
            if (!acc[key]) acc[key] = [];
            acc[key].push(video);
            return acc;
        }, {} as Record<string, SavedVideo[]>);

        return (
            <div className="space-y-10">
                {Object.keys(groups).map((dateKey) => (
                    <div key={dateKey} className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-red-500 pl-3">{dateKey}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups[dateKey].map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onSelect={setSelectedVideo}
                                    onDelete={(id) => setVideoToDelete(id)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="max-w-xl mx-auto w-full">
                <form onSubmit={handleAddVideo} className="flex gap-2 items-center">
                    <Input
                        placeholder="Paste YouTube URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-slate-900/50 border-white/10 text-white placeholder:text-gray-400 h-11 flex-1"
                    />
                    <Button type="submit" disabled={isAdding} className="bg-red-600 hover:bg-red-700 text-white h-11 px-6 shrink-0 transition-colors">
                        {isAdding ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                    </Button>
                </form>
            </div>

            <Tabs defaultValue="recent" className="w-full">
                <TabsList className="bg-slate-900/50 border-white/10 text-white mb-6 p-1">
                    <TabsTrigger value="recent" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-6 hover:bg-white/10 hover:text-white transition-colors">Recent</TabsTrigger>
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-red-600 data-[state=active]:text-white px-6 hover:bg-white/10 hover:text-white transition-colors">Favorites</TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-0">
                    {renderVideos(videos, "Paste a YouTube URL above to start building your library.")}
                </TabsContent>
                <TabsContent value="favorites" className="mt-0">
                    {renderVideos(videos.filter(v => v.is_favorite), "Mark videos as favorite to see them here.")}
                </TabsContent>
            </Tabs>

            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                video={selectedVideo}
            />

            <AlertDialog open={!!videoToDelete} onOpenChange={(open) => !open && setVideoToDelete(null)}>
                <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the video from your library.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


