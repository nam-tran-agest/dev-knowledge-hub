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
        <div className="group relative bg-white/5 hover:bg-white/10 border border-white/5 rounded-[32px] p-5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-[0.98] cursor-pointer">
            <div className="relative aspect-square overflow-hidden rounded-[24px] mb-4 shadow-lg shadow-black/20">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <span className="text-4xl">🎵</span>
                    </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-emerald-500 text-black p-4 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl shadow-emerald-500/30">
                        <Play className="h-6 w-6 fill-current" />
                    </div>
                </div>
            </div>

            <div className="space-y-1 px-1">
                <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm font-medium line-clamp-1">
                    {subtitle}
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
