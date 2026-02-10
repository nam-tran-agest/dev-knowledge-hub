'use client';

import { MusicCard, SpotifyItem } from './music-card';

interface MusicGridProps {
    items: SpotifyItem[];
    type: 'top-tracks' | 'top-artists' | 'playlists';
}

export function MusicGrid({ items, type }: MusicGridProps) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-[32px] border border-white/5">
                <p className="text-slate-500 text-lg">No items found in this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((item, idx) => (
                <MusicCard key={item.id || idx} item={item} type={type} />
            ))}
        </div>
    );
}
