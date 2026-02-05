"use client";

import Image from "next/image";
import { Play, Trash2, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SavedVideo } from "@/types/youtube";

interface VideoCardProps {
    video: SavedVideo;
    onSelect: (video: SavedVideo) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (e: React.MouseEvent, video: SavedVideo) => void;
}

export function VideoCard({ video, onSelect, onDelete, onToggleFavorite }: VideoCardProps) {
    return (
        <Card
            onClick={() => onSelect(video)}
            className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-red-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 cursor-pointer p-0"
        >
            <div className="flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                    {video.thumbnail_url ? (
                        <Image
                            src={video.thumbnail_url}
                            alt={video.title || "Video thumbnail"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-500">
                            No Thumbnail
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                    {/* Favorite Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => onToggleFavorite(e, video)}
                        className="absolute top-2 left-2 rounded-full z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                        title="Toggle Favorite"
                    >
                        <Heart
                            className={`w-4 h-4 ${video.is_favorite ? "fill-red-500 text-red-500" : "text-white"
                                }`}
                        />
                    </Button>

                    {/* Time Badge */}
                    {video.saved_time > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute bottom-2 right-2 bg-black/80 hover:bg-black/80 text-white gap-1 flex items-center"
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
                        className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 w-8 h-8 cursor-pointer"
                        title="Delete Video"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-5 space-y-3">
                    <h3
                        className="font-semibold text-base line-clamp-2 leading-relaxed text-white group-hover:text-red-400 transition-colors h-[3.5rem]"
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
