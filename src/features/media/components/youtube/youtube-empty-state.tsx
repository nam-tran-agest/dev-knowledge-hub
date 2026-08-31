'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, ListVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubeEmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    type?: 'videos' | 'playlists';
}

export function YouTubeEmptyState({
    title,
    description,
    actionLabel,
    onAction,
    type = 'videos',
}: YouTubeEmptyStateProps) {
    if (type === 'playlists') {
        return (
            <div className="col-span-full py-16 text-center bg-surface/80 border border-dashed border-primary/30 cyber-clip space-y-4 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
                <div className="w-12 h-12 bg-primary/10 border border-primary/30 cyber-clip-button flex items-center justify-center mx-auto mb-3 text-primary">
                    <ListVideo className="w-6 h-6" />
                </div>
                <h3 className="text-base font-mono font-bold uppercase tracking-wider text-white">[ {title} ]</h3>
                <p className="text-primary/60 font-mono text-xs max-w-sm mx-auto uppercase">// {description}</p>
                {actionLabel && onAction && (
                    <Button
                        onClick={onAction}
                        className="bg-primary text-black font-mono font-bold uppercase tracking-wider cyber-clip-button px-6 text-xs cursor-pointer shadow-[0_0_20px_var(--color-primary)] hover:bg-primary/90"
                    >
                        [ {actionLabel} ]
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Card className="text-center py-16 bg-surface/80 border border-dashed border-primary/30 cyber-clip relative overflow-hidden">
            <div className="absolute inset-0 hazard-stripes-cyan opacity-5 pointer-events-none" />
            <CardContent>
                <div className="inline-flex items-center justify-center w-12 h-12 cyber-clip-button bg-primary/10 border border-primary/30 mb-3 text-primary">
                    <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-mono font-bold uppercase tracking-wider mb-1 text-white">[ {title} ]</h3>
                <p className="text-primary/60 font-mono text-xs max-w-sm mx-auto uppercase">// {description}</p>
            </CardContent>
        </Card>
    );
}
