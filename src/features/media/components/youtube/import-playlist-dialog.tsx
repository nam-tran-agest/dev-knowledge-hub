'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { importYouTubePlaylist } from '@/features/media/services/youtube';
import { ListPlus, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImportPlaylistDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ImportPlaylistDialog({ isOpen, onClose }: ImportPlaylistDialogProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const router = useRouter();

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setFeedback(null);

        try {
            const result = await importYouTubePlaylist(url.trim());
            if (result.success) {
                setFeedback({
                    type: 'success',
                    message: result.message || 'Playlist successfully imported!'
                });
                setUrl('');
                router.refresh();
                setTimeout(() => {
                    onClose();
                    setFeedback(null);
                }, 1800);
            } else {
                setFeedback({
                    type: 'error',
                    message: result.message || 'Failed to import playlist.'
                });
            }
        } catch (error: unknown) {
            setFeedback({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unknown error during playlist import.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setFeedback(null); } }}>
            <DialogContent className="bg-surface/95 border-primary/40 text-white font-mono cyber-clip-lg max-w-lg shadow-[0_0_50px_rgba(0,240,255,0.25)]">
                <DialogHeader className="space-y-2 border-b border-primary/20 pb-4">
                    <DialogTitle className="text-base font-bold flex items-center gap-2 text-primary tracking-wider uppercase">
                        <ListPlus className="w-4 h-4 text-primary" />
                        IMPORT YOUTUBE PLAYLIST
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-300">
                        Paste any public or unlisted YouTube playlist link. All videos will be batch extracted and saved into your hub.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleImport} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="playlist-url" className="text-xs font-bold uppercase text-primary/80 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-primary" />
                            PLAYLIST URL OR ID
                        </Label>
                        <Input
                            id="playlist-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/playlist?list=PL..."
                            disabled={isLoading}
                            className="bg-surface-deep border-primary/30 text-xs font-mono text-white placeholder:text-primary/40 focus-visible:ring-primary cyber-clip-button h-10"
                            required
                        />
                        <p className="text-[10px] text-primary/60">
                            Example: https://www.youtube.com/playlist?list=PL4cUxeGndRTHb...
                        </p>
                    </div>

                    {feedback && (
                        <div className={`p-3 cyber-clip-button border text-xs flex items-center gap-2 ${
                            feedback.type === 'success' 
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                                : 'bg-destructive/10 border-destructive/40 text-destructive'
                        }`}>
                            {feedback.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
                            )}
                            <span>{feedback.message}</span>
                        </div>
                    )}

                    <DialogFooter className="pt-3 border-t border-primary/20 flex flex-row items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                            className="cyber-clip-button text-xs uppercase cursor-pointer hover:bg-primary/10 text-primary/70"
                        >
                            [ CANCEL ]
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !url.trim()}
                            className="bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider text-xs cyber-clip-button cursor-pointer shadow-[0_0_15px_var(--color-primary)]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                    <span>[ EXTRACTING... ]</span>
                                </>
                            ) : (
                                <span>[ + BATCH_IMPORT ]</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
