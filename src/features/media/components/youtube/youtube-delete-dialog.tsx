'use client';

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface YouTubeDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    cancelLabel: string;
    deleteLabel: string;
}

export function YouTubeDeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    cancelLabel,
    deleteLabel,
}: YouTubeDeleteDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="bg-card border-white/10 text-white rounded-3xl backdrop-blur-2xl glare-top">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-white tracking-tight">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400 text-sm">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08] hover:text-white rounded-xl cursor-pointer">
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-rose-600 text-white hover:bg-rose-500 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                        {deleteLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
