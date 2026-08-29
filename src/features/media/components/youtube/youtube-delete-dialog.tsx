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
            <AlertDialogContent tag="DELETE_VERIFICATION">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-mono font-bold uppercase tracking-wider text-destructive">
                        // {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-primary/70 font-mono text-xs">
                        // {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel onClick={onClose} className="font-mono text-xs uppercase">
                        [ {cancelLabel} ]
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90 text-white font-mono text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                        [ {deleteLabel} ]
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
