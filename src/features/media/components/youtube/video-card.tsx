"use client";

import Image from "next/image";
import { Play, Trash2, Clock, Heart, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SavedVideo, SavedPlaylist } from "@/features/media/types";
import { useTranslations } from "next-intl";

interface VideoCardProps {
    video: SavedVideo;
    onSelect: (video: SavedVideo) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (e: React.MouseEvent, video: SavedVideo) => void;
    playlists?: SavedPlaylist[];
    onAddToPlaylist?: (videoId: string) => void;
}

export function VideoCard({ video, onSelect, onDelete, onToggleFavorite, onAddToPlaylist }: VideoCardProps) {
    const t = useTranslations('media.youtube.video');

    return (
        <Card
            onClick={() => onSelect(video)}
            className="group relative overflow-hidden bg-[#050714]/90 border border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 cursor-pointer p-0 cyber-clip backdrop-blur-2xl"
        >
            <div className="flex flex-col h-full">
                {/* Thumbnail Area */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#04060f]">
                    {video.thumbnail_url ? (
                        <Image
                            src={video.thumbnail_url}
                            alt={video.title || t('thumbnailAlt')}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-primary/40 font-mono text-xs uppercase">
                            // NO_FEED_DATA
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04060f]/90 via-transparent to-black/30 opacity-90" />

                    {/* Top Action Row */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
                        {/* Favorite Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(e, video);
                            }}
                            className="cyber-clip-button w-7 h-7 bg-black/80 hover:bg-primary/20 text-white backdrop-blur-md cursor-pointer border border-primary/30 pointer-events-auto"
                            title={t('toggleFavorite')}
                        >
                            <Heart
                                className={`w-3.5 h-3.5 ${video.is_favorite ? "fill-rose-500 text-rose-500" : "text-primary/70"}`}
                            />
                        </Button>

                        {/* Top-Right Action Group */}
                        <div className="flex items-center gap-1.5 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            {onAddToPlaylist && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToPlaylist(video.id);
                                    }}
                                    className="cyber-clip-button w-7 h-7 bg-black/80 hover:bg-primary/25 text-primary backdrop-blur-md cursor-pointer border border-primary/40"
                                    title={t('addToPlaylist')}
                                >
                                    <ListPlus className="w-3.5 h-3.5" />
                                </Button>
                            )}

                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(video.id);
                                }}
                                className="cyber-clip-button w-7 h-7 cursor-pointer bg-destructive/80 hover:bg-destructive text-white border border-destructive/50"
                                title={t('delete')}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Metadata Badges */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
                        {/* Telemetry Video ID Tag */}
                        <div className="px-1.5 py-0.5 bg-black/80 backdrop-blur-md border border-primary/30 cyber-clip-tag text-[9px] uppercase tracking-widest text-primary/80 font-mono">
                            // VID_{video.id.slice(0, 4)}
                        </div>

                        {/* Saved Time Badge */}
                        {video.saved_time > 0 && (
                            <div className="inline-flex flex-row items-center gap-1.5 whitespace-nowrap leading-none px-2 py-1 bg-black/90 backdrop-blur-md text-primary font-mono text-[10px] font-bold border border-primary/40 cyber-clip-tag shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                <Clock className="w-3 h-3 text-primary shrink-0" />
                                <span className="tracking-wider">{formatTime(video.saved_time)}</span>
                            </div>
                        )}
                    </div>

                    {/* Center Hologram Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-12 h-12 cyber-clip-button bg-primary/20 border border-primary backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_var(--color-primary)]">
                            <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-3.5 space-y-2">
                    <h3
                        className="font-mono font-bold text-xs sm:text-sm line-clamp-2 leading-relaxed text-slate-100 group-hover:text-primary transition-colors uppercase tracking-wide"
                        title={video.title || undefined}
                    >
                        {video.title}
                    </h3>
                </CardContent>
            </div>
        </Card>
    );
}

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
