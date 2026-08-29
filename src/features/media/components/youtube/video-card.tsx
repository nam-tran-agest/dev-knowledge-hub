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
            className="group relative overflow-hidden bg-white/[0.03] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05] transition-all duration-300 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:-translate-y-1 cursor-pointer p-0 rounded-3xl backdrop-blur-xl"
        >
            <div className="flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    {video.thumbnail_url ? (
                        <Image
                            src={video.thumbnail_url}
                            alt={video.title || t('thumbnailAlt')}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-slate-500 text-sm">
                            {t('noThumbnail')}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-transparent opacity-60" />

                    {/* Favorite Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(e, video);
                        }}
                        className="absolute top-3 left-3 rounded-full z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer border border-white/10"
                        title={t('toggleFavorite')}
                    >
                        <Heart
                            className={`w-4 h-4 ${video.is_favorite ? "fill-rose-500 text-rose-500" : "text-white"
                                }`}
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
                            className="absolute bottom-3 left-3 rounded-full z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity border border-white/10"
                            title={t('addToPlaylist')}
                        >
                            <ListPlus className="w-4 h-4" />
                        </Button>
                    )}

                    {/* Time Badge */}
                    {video.saved_time > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md hover:bg-black/80 text-white gap-1 flex items-center text-xs font-mono border border-white/10"
                        >
                            <Clock className="w-3 h-3" />
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
                        className="absolute top-3 right-3 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 w-8 h-8 cursor-pointer shadow-md"
                        title={t('delete')}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-600/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-4 sm:p-5 space-y-2">
                    <h3
                        className="font-semibold text-sm sm:text-base line-clamp-2 leading-relaxed text-white group-hover:text-rose-300 transition-colors"
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
