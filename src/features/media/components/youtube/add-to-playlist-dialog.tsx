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
            <DialogContent tag="PLAYLIST_ALLOCATOR" className="sm:max-w-[420px] p-0 overflow-hidden">
                <DialogHeader className="p-5 pb-2 border-b border-primary/20">
                    <DialogTitle className="text-base font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <ListVideo className="w-4 h-4 text-primary" />
                        // {t('dialogs.addToPlaylist.title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-1">
                    <ScrollArea className="h-[280px] px-4 py-2">
                        {playlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-2 font-mono">
                                <ListVideo className="w-8 h-8 text-primary/40" />
                                <p className="text-primary/60 text-xs uppercase">
                                    // {t('dialogs.addToPlaylist.empty')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {playlists.map((playlist) => (
                                    <button
                                        key={playlist.id}
                                        onClick={() => handleAdd(playlist.id)}
                                        disabled={!!isSubmitting}
                                        className="w-full flex items-center justify-between p-2.5 cyber-clip-button bg-primary/[0.04] hover:bg-primary/15 border border-primary/20 hover:border-primary/60 transition-all group disabled:opacity-40 cursor-pointer font-mono"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black">
                                                <ListVideo className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-slate-200 group-hover:text-white uppercase transition-colors">
                                                    {playlist.title}
                                                </p>
                                                <p className="text-[10px] text-primary/60 uppercase">
                                                    // {t('gallery.videoCount', { count: playlist.video_count || 0 })}
                                                </p>
                                            </div>
                                        </div>
                                        {isSubmitting === playlist.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        ) : (
                                            <div className="w-5 h-5 cyber-clip-sm border border-primary/30 flex items-center justify-center group-hover:border-primary">
                                                <Check className="w-3 h-3 text-transparent group-hover:text-primary" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-3 bg-[#04060f] border-t border-primary/20">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-primary/70 hover:text-white hover:bg-primary/10 cyber-clip-button w-full font-mono text-xs uppercase"
                    >
                        [ {t('dialogs.addToPlaylist.close')} ]
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
