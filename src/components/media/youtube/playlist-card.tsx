"use client";

import { Trash2, Heart, ListVideo, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SavedPlaylist } from "@/types/youtube";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PlaylistCardProps {
    playlist: SavedPlaylist;
    onDelete: (id: string) => void;
    onToggleFavorite: (e: React.MouseEvent, playlist: SavedPlaylist) => void;
}

export function PlaylistCard({ playlist, onDelete, onToggleFavorite }: PlaylistCardProps) {
    const t = useTranslations('media.youtube.gallery');

    return (
        <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-red-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 p-0">
            <div className="flex flex-col h-full">
                {/* Playlist Icon / Thumbnail placeholder */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <ListVideo className="w-12 h-12 text-red-500" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Playlist</span>
                    </div>

                    {/* Visual stack effect for "playlist" look */}
                    <div className="absolute top-2 right-2 w-full h-full border-r-4 border-b-4 border-white/5 rounded-lg -z-0 translate-x-1 translate-y-1" />
                    <div className="absolute top-2 right-2 w-full h-full border-r-4 border-b-4 border-white/10 rounded-lg -z-0 translate-x-2 translate-y-2" />

                    {/* Favorite Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => onToggleFavorite(e, playlist)}
                        className="absolute top-2 left-2 rounded-full z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white cursor-pointer"
                        title="Toggle Favorite"
                    >
                        <Heart
                            className={`w-4 h-4 ${playlist.is_favorite ? "fill-red-500 text-red-500" : "text-white"}`}
                        />
                    </Button>

                    {/* Delete Button */}
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(playlist.id);
                        }}
                        className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 w-8 h-8 cursor-pointer"
                        title="Delete Playlist"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-red-600 hover:bg-red-700 text-white border-0">
                            {t('videoCount', { count: playlist.video_count || 0 })}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-5 space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                            {playlist.title}
                        </h3>
                        {playlist.description && (
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                {playlist.description}
                            </p>
                        )}
                    </div>

                    <Link href={`/media/youtube/playlist/${playlist.id}`} className="mt-4 block">
                        <Button variant="ghost" className="w-full justify-between items-center bg-white/5 hover:bg-white/10 text-white border-white/5">
                            {t('viewContent')}
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Link>
                </CardContent>
            </div>
        </Card>
    );
}
