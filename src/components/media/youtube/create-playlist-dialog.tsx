"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlaylist } from "@/lib/actions/youtube";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreatePlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
    const t = useTranslations('media.youtube.dialogs.createPlaylist');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(e.currentTarget);
            await createPlaylist(formData);
            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create playlist:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{t('title')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">{t('titleLabel')}</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder={t('titlePlaceholder')}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-gray-500"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">{t('descriptionLabel')}</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder={t('descriptionPlaceholder')}
                            className="bg-slate-800 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {t('submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
