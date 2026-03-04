import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateNote, deleteNote } from '@/features/notes/services/notes';
import type { Note } from '@/features/notes/types';

export function useNoteEditor(note: Note) {
    const router = useRouter();
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content || '');
    const [tags, setTags] = useState(note.tags?.join(', ') || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setTitle(note.title);
        setContent(note.content || '');
        setTags(note.tags?.join(', ') || '');
        setMode('view');
    }, [note.id, note.title, note.content, note.tags]);

    async function onSave() {
        setSaving(true);
        try {
            await updateNote(String(note.id), {
                title,
                content,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            });
            setMode('view');
            router.refresh();
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            setSaving(false);
        }
    }

    async function onDelete() {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await deleteNote(String(note.id));
            router.refresh();
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    }

    return {
        mode,
        setMode,
        title,
        setTitle,
        content,
        setContent,
        tags,
        setTags,
        saving,
        onSave,
        onDelete,
        router,
    };
}
