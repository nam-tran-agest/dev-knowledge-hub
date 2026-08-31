'use client';

import { Trash2, Heart, ListVideo, Edit2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SavedPlaylist } from "@/features/media/types";
import { useTranslations } from "next-intl";
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
            className="group relative overflow-hidden bg-surface/90 border border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 p-0 cursor-pointer cyber-clip backdrop-blur-2xl"
            onClick={() => router.push(`/media/youtube/playlist/${playlist.id}`)}
        >
            <div className="flex flex-col h-full">
                {/* Playlist Thumbnail Deck */}
                <div className="relative aspect-video w-full overflow-hidden bg-background">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none z-0 bg-grid-cyber" />

                    <div className="absolute inset-0 flex items-center justify-center p-3 z-10">
                        <div className={`relative w-full h-full cyber-clip overflow-hidden border border-primary/20 bg-surface-deep transform transition-all duration-500 ease-out 
                            ${playlist.video_thumbnails?.length ? 'group-hover:scale-105' : 'group-hover:scale-102'}`}>

                            {playlist.video_thumbnails?.length ? (
                                <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                                    {[0, 1, 2, 3].map((idx) => (
                                        <div key={idx} className="relative w-full h-full overflow-hidden bg-background">
                                            <Image
                                                src={playlist.video_thumbnails?.[idx] || playlist.video_thumbnails?.[0] || ""}
                                                alt="" fill className="object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-[#04060f] flex items-center justify-center">
                                    {playlist.thumbnail_url ? (
                                        <Image src={playlist.thumbnail_url} alt={playlist.title} fill className="object-cover opacity-80" />
                                    ) : (
                                        <ListVideo className="w-10 h-10 text-primary/40" />
                                    )}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                                </div>
                            )}

                            {/* Center Glass Play Icon */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-primary/20 backdrop-blur-md p-3 cyber-clip-button border border-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_var(--color-primary)]">
                                    <ListVideo className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Controls Layer */}
                    <div className="absolute inset-0 p-2.5 flex flex-col justify-between pointer-events-none z-20">
                        {/* Top Actions Row */}
                        <div className="flex justify-between items-center w-full">
                            <div className="pointer-events-auto">
                                <Button
                                    variant="ghost" size="icon"
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(e, playlist); }}
                                    className="cyber-clip-button w-7 h-7 bg-black/80 hover:bg-primary/20 text-white border border-primary/30 backdrop-blur-sm cursor-pointer"
                                >
                                    <Heart className={`w-3.5 h-3.5 ${playlist.is_favorite ? "fill-rose-500 text-rose-500" : "text-primary/70"}`} />
                                </Button>
                            </div>

                            <div className="flex gap-1.5 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                {onEdit && (
                                    <Button
                                        variant="secondary" size="icon"
                                        onClick={(e) => { e.stopPropagation(); onEdit(playlist); }}
                                        className="cyber-clip-button w-7 h-7 bg-black/80 hover:bg-primary/25 text-primary border border-primary/30 backdrop-blur-sm cursor-pointer"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                                <Button
                                    variant="destructive" size="icon"
                                    onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}
                                    className="cyber-clip-button w-7 h-7 bg-destructive/80 hover:bg-destructive text-white border border-destructive/50 cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Metadata Row */}
                        <div className="flex justify-between items-center w-full">
                            <div className="px-1.5 py-0.5 bg-black/80 backdrop-blur-md border border-primary/30 cyber-clip-tag text-[9px] uppercase tracking-widest text-primary/80 font-mono pointer-events-auto">
                                // PL_{playlist.id.slice(0, 4)}
                            </div>
                            <div className="pointer-events-auto">
                                <Badge variant="secondary" className="bg-black/80 backdrop-blur-md text-primary font-mono border border-primary/30 px-2 py-0.5 text-[10px]">
                                    {t('videoCount', { count: playlist.video_count || 0 })}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-3.5 space-y-1.5">
                    <h3 className="font-mono font-bold text-xs sm:text-sm text-slate-100 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-wider">
                        {playlist.title}
                    </h3>
                    {playlist.description && (
                        <p className="text-slate-400 text-[11px] font-mono line-clamp-2 leading-relaxed uppercase">
                            // {playlist.description}
                        </p>
                    )}
                </CardContent>
            </div>
        </Card>
    );
}
