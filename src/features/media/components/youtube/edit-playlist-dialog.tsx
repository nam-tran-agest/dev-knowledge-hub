"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePlaylist } from "@/features/media/services/youtube";
import { Loader2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SavedPlaylist } from "@/features/media/types";

interface EditPlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlist: SavedPlaylist | null;
}

export function EditPlaylistDialog({ open, onOpenChange, playlist }: EditPlaylistDialogProps) {
    const t = useTranslations('media.youtube.dialogs');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!playlist) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData(e.currentTarget);
            await updatePlaylist(playlist.id, formData);
            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update playlist:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent tag="PLAYLIST_CONFIG" className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle className="text-base font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        // {t('editPlaylist.title')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-title" className="text-primary/80 font-mono text-xs uppercase tracking-wider">{t('createPlaylist.titleLabel')} *</Label>
                        <Input
                            id="edit-title"
                            name="title"
                            defaultValue={playlist?.title || ""}
                            placeholder={t('createPlaylist.titlePlaceholder')}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-description" className="text-primary/80 font-mono text-xs uppercase tracking-wider">{t('createPlaylist.descriptionLabel')}</Label>
                        <Textarea
                            id="edit-description"
                            name="description"
                            defaultValue={playlist?.description || ""}
                            placeholder={t('createPlaylist.descriptionPlaceholder')}
                            className="min-h-[90px]"
                        />
                    </div>
                    <DialogFooter className="pt-3 border-t border-primary/20 gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-primary/70 hover:text-white hover:bg-primary/10 cyber-clip-button font-mono text-xs uppercase"
                        >
                            [ {t('createPlaylist.cancel')} ]
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-black font-mono font-bold uppercase tracking-wider cyber-clip-button shadow-[0_0_15px_var(--color-primary)] hover:bg-primary/90 text-xs"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                            [ {t('editPlaylist.submit')} ]
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
