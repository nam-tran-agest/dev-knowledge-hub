'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

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
        <div className="cyber-clip glass-panel p-4 sm:p-6 border border-primary/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Top Tag */}
            <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[9px] uppercase tracking-widest text-primary/70 font-mono">
                // INPUT_URL_STREAM
            </div>
            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50" />

            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="relative flex-1">
                    <Input
                        placeholder={placeholder}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-[#040612]/90 border-primary/30 text-white placeholder:text-primary/40 focus:border-primary h-11 text-xs sm:text-sm w-full cyber-clip-button font-mono"
                        disabled={isAdding}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isAdding || !url}
                    className="bg-primary text-black font-mono font-bold uppercase tracking-wider px-8 h-11 text-xs sm:text-sm transition-all w-full sm:w-auto shrink-0 cyber-clip-button cursor-pointer shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/90"
                >
                    <Terminal className="w-3.5 h-3.5 mr-1.5" />
                    {isAdding ? addingLabel : buttonLabel}
                </Button>
            </form>
        </div>
    );
}
