
'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Music, User, Library, LogOut } from 'lucide-react';
import { disconnectSpotify } from '@/lib/actions/spotify';

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
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-r border-white/5 bg-[#0a0a0c] flex flex-col">
            <div className="p-6 md:p-8 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">Library</h3>
                    <nav className="space-y-1">
                        {CATEGORIES.map((cat) => {
                            const isActive = cat.id === currentCategory;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/media/music?category=${cat.id}`}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                        isActive
                                            ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <cat.icon className="h-5 w-5" />
                                    <span>{cat.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <button
                        onClick={() => disconnectSpotify()}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all w-full text-left font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Disconnect</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
