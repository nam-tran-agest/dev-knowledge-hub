'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface YouTubeSearchBarProps {
    url: string;
    setUrl: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isAdding: boolean;
    placeholder: string;
    buttonLabel: string;
    addingLabel: string;
}

export function YouTubeSearchBar({
    url,
    setUrl,
    onSubmit,
    isAdding,
    placeholder,
    buttonLabel,
    addingLabel,
}: YouTubeSearchBarProps) {
    return (
        <div className="bg-[#070d1e]/50 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl glare-top">
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder={placeholder}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-[#040711]/80 border-white/10 text-white placeholder:text-slate-500 focus:border-rose-500/50 h-12 text-sm sm:text-base w-full rounded-2xl font-mono"
                    disabled={isAdding}
                />
                <Button
                    type="submit"
                    disabled={isAdding || !url}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-8 h-12 text-sm sm:text-base font-semibold transition-all transform hover:scale-105 active:scale-95 w-full sm:w-auto shrink-0 rounded-2xl cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                >
                    {isAdding ? addingLabel : buttonLabel}
                </Button>
            </form>
        </div>
    );
}
