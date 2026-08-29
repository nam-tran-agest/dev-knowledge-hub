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
            <div className="col-span-full py-20 text-center bg-card border border-dashed border-white/10 rounded-3xl space-y-4 backdrop-blur-xl">
                <div className="w-16 h-16 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListVideo className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">{description}</p>
                {actionLabel && onAction && (
                    <Button
                        onClick={onAction}
                        className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl px-6 font-mono text-xs cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    >
                        {actionLabel}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Card className="text-center py-20 bg-card border-white/10 backdrop-blur-xl rounded-3xl glare-top">
            <CardContent>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
                    <PlayCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">{description}</p>
            </CardContent>
        </Card>
    );
}
