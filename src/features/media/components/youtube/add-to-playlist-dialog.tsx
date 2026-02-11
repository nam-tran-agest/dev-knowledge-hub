"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addVideoToPlaylist } from "@/features/media/services/youtube";
import type { SavedPlaylist } from "@/features/media/types";
import { Check, ListVideo, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToPlaylistDialogProps {
    videoId: string | null;
    playlists: SavedPlaylist[];
    onClose: () => void;
}

export function AddToPlaylistDialog({ videoId, playlists, onClose }: AddToPlaylistDialogProps) {
    const t = useTranslations('media.youtube');
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const router = useRouter();

    async function handleAdd(playlistId: string) {
        if (!videoId) return;
        setIsSubmitting(playlistId);
        try {
            await addVideoToPlaylist(videoId, playlistId);
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to add to playlist:", error);
        } finally {
            setIsSubmitting(null);
        }
    }

    return (
        <Dialog open={!!videoId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[400px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ListVideo className="w-5 h-5 text-red-500" />
                        {t('dialogs.addToPlaylist.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-1">
                    <ScrollArea className="h-[300px] px-5 py-2">
                        {playlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-3">
                                <ListVideo className="w-10 h-10 text-gray-600" />
                                <p className="text-gray-400 text-sm">
                                    {t('dialogs.addToPlaylist.empty')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {playlists.map((playlist) => (
                                    <button
                                        key={playlist.id}
                                        onClick={() => handleAdd(playlist.id)}
                                        disabled={!!isSubmitting}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-600/10 border border-white/5 hover:border-red-500/30 transition-all group disabled:opacity-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-red-600/20">
                                                <ListVideo className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-white group-hover:text-red-400 transition-colors">
                                                    {playlist.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t('gallery.videoCount', { count: playlist.video_count || 0 })}
                                                </p>
                                            </div>
                                        </div>
                                        {isSubmitting === playlist.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-500/50">
                                                <Check className="w-3 h-3 text-transparent group-hover:text-red-500/50" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-4 bg-black/20 border-t border-white/5">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-white/5 w-full"
                    >
                        {t('dialogs.addToPlaylist.close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
