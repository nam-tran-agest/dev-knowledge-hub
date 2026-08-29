'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Music, User, Library, LogOut, Terminal } from 'lucide-react';
import { disconnectSpotify } from '@/features/media/services/spotify';

interface MusicSidebarProps {
    currentCategory: string;
}

const CATEGORIES = [
    { id: 'top-tracks', label: 'Top Tracks', icon: Music },
    { id: 'top-artists', label: 'Top Artists', icon: User },
    { id: 'playlists', label: 'Playlists', icon: Library },
];

export function MusicSidebar({ currentCategory }: MusicSidebarProps) {
    return (
        <aside className="w-full lg:w-72 shrink-0 border-b lg:border-r border-primary/20 bg-[#04060f]/90 backdrop-blur-2xl flex flex-col">
            <div className="p-5 space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary/70">// AUDIO_CHANNELS</h3>
                    </div>
                    <nav className="space-y-1">
                        {CATEGORIES.map((cat, idx) => {
                            const isActive = cat.id === currentCategory;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/media/music?category=${cat.id}`}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 cyber-clip-button transition-all duration-200 font-mono text-xs uppercase tracking-wider border",
                                        isActive
                                            ? "bg-primary/20 text-primary border-primary font-bold shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                                            : "text-primary/70 border-transparent hover:border-primary/30 hover:bg-primary/5 hover:text-white"
                                    )}
                                >
                                    <cat.icon className="h-4 w-4" />
                                    <span>[ 0{idx + 1}-{cat.label} ]</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-4 border-t border-primary/20">
                    <button
                        onClick={() => disconnectSpotify()}
                        className="flex items-center gap-2.5 px-3 py-2 cyber-clip-button text-destructive hover:bg-destructive/15 border border-destructive/30 transition-all w-full text-left font-mono text-xs uppercase font-bold cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>[ DISCONNECT_SESSION ]</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
