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
        <div className="cyber-clip glass-panel p-5 sm:p-7 border border-primary/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Top Tag positioned cleanly inside header space */}
            <div className="absolute top-3 right-6 px-3 py-0.5 bg-primary/10 border border-primary/30 cyber-clip-tag text-[10px] uppercase tracking-widest text-primary font-mono font-bold">
                // INPUT_URL_STREAM
            </div>
            <div className="absolute inset-0 cyber-brackets pointer-events-none opacity-50" />

            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 relative z-10 pt-4 sm:pt-2">
                <div className="relative flex-1">
                    <Input
                        placeholder={placeholder}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-[#040612]/90 border-primary/40 text-white placeholder:text-primary/40 focus:border-primary h-11 text-xs sm:text-sm w-full cyber-clip-button font-mono px-4"
                        disabled={isAdding}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={isAdding || !url}
                    className="bg-primary text-black font-mono font-bold uppercase tracking-wider px-8 h-11 text-xs sm:text-sm transition-all w-full sm:w-auto shrink-0 cyber-clip-button cursor-pointer shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/90 disabled:opacity-50"
                >
                    <Terminal className="w-4 h-4 mr-2 text-black" />
                    {isAdding ? addingLabel : buttonLabel}
                </Button>
            </form>
        </div>
    );
}
