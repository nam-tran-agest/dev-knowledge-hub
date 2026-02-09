"use client";

import { Trash2, Heart, ListVideo, ExternalLink, Image as ImageIcon, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SavedPlaylist } from "@/types/youtube";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlaylistCardProps {
    playlist: SavedPlaylist;
    onDelete: (id: string) => void;
    onToggleFavorite: (e: React.MouseEvent, playlist: SavedPlaylist) => void;
    onEdit?: (playlist: SavedPlaylist) => void;
}

export function PlaylistCard({ playlist, onDelete, onToggleFavorite, onEdit }: PlaylistCardProps) {
    const t = useTranslations('media.youtube.gallery');
    const router = useRouter();

    return (
        <Card
            className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-red-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 p-0 cursor-pointer"
            onClick={() => router.push(`/media/youtube/playlist/${playlist.id}`)}
        >
            <div className="flex flex-col h-full">
                {/* Playlist Icon / Thumbnail placeholder */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 group">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                        style={{ backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                    <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
                        <div className={`relative w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 transform transition-all duration-700 ease-out 
                            ${playlist.video_thumbnails?.length ? 'rotate-[-2deg] skew-x-2 group-hover:rotate-0 group-hover:skew-x-0 group-hover:scale-[1.05]' : 'group-hover:scale-[1.02]'}`}>

                            {playlist.video_thumbnails?.length ? (
                                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                                    {[0, 1, 2, 3].map((idx) => (
                                        <div key={idx} className="relative w-full h-full overflow-hidden bg-slate-800">
                                            <Image
                                                src={playlist.video_thumbnails?.[idx] || playlist.video_thumbnails?.[0] || ""}
                                                alt="" fill className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                                    {playlist.thumbnail_url ? (
                                        <Image src={playlist.thumbnail_url} alt={playlist.title} fill className="object-cover" />
                                    ) : (
                                        <ListVideo className="w-12 h-12 text-slate-600" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>
                            )}

                            {/* Center Glass Play Icon (Shared) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                    <ListVideo className="w-8 h-8 text-white drop-shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Controls Layer (Shared) */}
                    <div className="absolute inset-0 p-4 pointer-events-none z-20">
                        {/* Top Actions */}
                        <div className="flex justify-between items-start w-full">
                            <div className="pointer-events-auto">
                                <Button
                                    variant="ghost" size="icon"
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(e, playlist); }}
                                    className="rounded-full w-8 h-8 bg-black/40 hover:bg-black/60 text-white border-0 backdrop-blur-sm"
                                >
                                    <Heart className={`w-4 h-4 ${playlist.is_favorite ? "fill-red-500 text-red-500" : "text-white"}`} />
                                </Button>
                            </div>

                            <div className="flex gap-2 pointer-events-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                {onEdit && (
                                    <Button
                                        variant="secondary" size="icon"
                                        onClick={(e) => { e.stopPropagation(); onEdit(playlist); }}
                                        className="rounded-full w-8 h-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="destructive" size="icon"
                                    onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
                                    className="rounded-full w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white border-0 shadow-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Badge */}
                        <div className="absolute bottom-4 right-4 pointer-events-auto">
                            <Badge variant="secondary" className="bg-red-600 font-bold text-white border-0 shadow-lg px-2 py-0.5 text-[10px]">
                                {t('videoCount', { count: playlist.video_count || 0 })}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-3 sm:p-5 space-y-3">
                    <div className="space-y-1">
                        <h3 className="font-semibold text-base sm:text-lg text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                            {playlist.title}
                        </h3>
                        {playlist.description && (
                            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                                {playlist.description}
                            </p>
                        )}
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

