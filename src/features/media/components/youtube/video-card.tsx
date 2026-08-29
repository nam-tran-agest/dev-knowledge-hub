"use client";

import Image from "next/image";
import { Play, Trash2, Clock, Heart, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
            className="group relative overflow-hidden bg-card/70 border-primary/30 hover:border-primary hover:bg-card transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:-translate-y-1 cursor-pointer p-0 cyber-clip backdrop-blur-2xl"
        >
            {/* Top Corner Bracket */}
            <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[9px] uppercase tracking-widest text-primary/70 font-mono z-20">
                // VID_{video.id.slice(0, 4)}
            </div>

            <div className="flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#050714]">
                    {video.thumbnail_url ? (
                        <Image
                            src={video.thumbnail_url}
                            alt={video.title || t('thumbnailAlt')}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-primary/40 font-mono text-xs uppercase">
                            // NO_FEED_DATA
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#04060f]/90 via-transparent to-transparent opacity-80" />

                    {/* Favorite Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(e, video);
                        }}
                        className="absolute top-2.5 left-2.5 cyber-clip-button z-10 w-7 h-7 bg-black/70 hover:bg-primary/20 text-white backdrop-blur-md cursor-pointer border border-primary/30"
                        title={t('toggleFavorite')}
                    >
                        <Heart
                            className={`w-3.5 h-3.5 ${video.is_favorite ? "fill-rose-500 text-rose-500" : "text-primary/70"}`}
                        />
                    </Button>

                    {/* Add to Playlist Button */}
                    {onAddToPlaylist && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToPlaylist(video.id);
                            }}
                            className="absolute bottom-2.5 left-2.5 cyber-clip-button z-10 w-7 h-7 bg-black/70 hover:bg-primary/20 text-primary backdrop-blur-md cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity border border-primary/30"
                            title={t('addToPlaylist')}
                        >
                            <ListPlus className="w-3.5 h-3.5" />
                        </Button>
                    )}

                    {/* Time Badge */}
                    {video.saved_time > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-primary gap-1 flex items-center text-[10px] font-mono border border-primary/30"
                        >
                            <Clock className="w-3 h-3 text-primary" />
                            {formatTime(video.saved_time)}
                        </Badge>
                    )}

                    {/* Delete Button */}
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(video.id);
                        }}
                        className="absolute top-2.5 right-2.5 cyber-clip-button opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 w-7 h-7 cursor-pointer bg-destructive/80 hover:bg-destructive border border-destructive/50"
                        title={t('delete')}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="w-11 h-11 cyber-clip-button bg-primary/20 border border-primary backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_var(--color-primary)]">
                            <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-4 space-y-2">
                    <h3
                        className="font-mono font-bold text-xs sm:text-sm line-clamp-2 leading-relaxed text-white group-hover:text-primary transition-colors uppercase tracking-wide"
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
