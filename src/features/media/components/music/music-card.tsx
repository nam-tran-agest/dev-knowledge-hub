'use client';

import Image from 'next/image';
import { Play } from "lucide-react";
import { Link } from '@/i18n/routing';
import React from 'react';

export interface SpotifyItem {
    id: string;
    name: string;
    album?: { images: { url: string }[] };
    images?: { url: string }[];
    artists?: { name: string }[];
    owner?: { display_name: string };
    genres?: string[];
    external_urls?: { spotify: string };
    tracks?: { total: number };
}

interface MusicCardProps {
    item: SpotifyItem;
    type: 'top-tracks' | 'top-artists' | 'playlists';
}

export function MusicCard({ item, type }: MusicCardProps) {
    const imageUrl = type === 'top-tracks'
        ? item.album?.images?.[0]?.url
        : item.images?.[0]?.url;

    const title = item.name;
    const subtitle = type === 'top-tracks'
        ? item.artists?.map((a: { name: string }) => a.name).join(', ')
        : type === 'playlists'
            ? `By ${item.owner?.display_name}`
            : item.genres?.slice(0, 2).join(', ');

    return (
        <div className="group relative bg-[#050714]/80 hover:bg-primary/10 border border-primary/25 hover:border-primary cyber-clip p-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:-translate-y-1 cursor-pointer">
            {/* Top Corner Bracket */}
            <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[8px] uppercase tracking-widest text-primary/70 font-mono z-20">
                // TRACK_{item.id.slice(0, 4)}
            </div>

            <div className="relative aspect-square overflow-hidden cyber-clip mb-3 shadow-lg bg-black">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
                    />
                ) : (
                    <div className="w-full h-full bg-[#04060f] flex items-center justify-center font-mono text-xs text-primary/40">
                        // NO_AUDIO_ART
                    </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <div className="bg-primary/20 text-primary border border-primary p-3 cyber-clip-button shadow-[0_0_20px_var(--color-primary)]">
                        <Play className="h-5 w-5 fill-primary" />
                    </div>
                </div>
            </div>

            <div className="space-y-0.5 font-mono">
                <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors uppercase">
                    {title}
                </h3>
                <p className="text-primary/60 text-[10px] sm:text-xs truncate uppercase">
                    // {subtitle}
                </p>
            </div>

            {type === 'playlists' ? (
                <Link
                    href={`/media/music/playlist/${item.id}`}
                    className="absolute inset-0 z-10"
                />
            ) : (
                <a
                    href={item.external_urls?.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                />
            )}
        </div>
    );
}
