import { useState, useRef, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

export function usePipDraggable(isPip: boolean) {
    const [position, setPosition] = useState<Position | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<Position>({ x: 0, y: 0 });

    // Handle Dragging Events
    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragStartRef.current) return;
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleDragStart = (e: React.MouseEvent) => {
        if (!isPip) return;

        // Prevent dragging when clicking buttons or links
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;

        // Find the draggable container
        const target = e.currentTarget as HTMLElement;
        const dialogNode = target.closest('[role="dialog"]') || target.closest('.pip-draggable');

        if (dialogNode) {
            const rect = dialogNode.getBoundingClientRect();
            // If starting from CSS position (null), we need to ensure we calculate dragging correctly.
            // DragStartRef is offset of mouse relative to TOP-LEFT of element.
            dragStartRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            // Set initial absolute position to current rect to prevent jumping
            // Only if we haven't set a position yet (optional, but safer)
            if (!position) {
                setPosition({ x: rect.left, y: rect.top });
            }

            setIsDragging(true);
        }
    };

    return {
        position,
        isDragging,
        handleDragStart,
        style: isPip && position ? {
            top: position.y,
            left: position.x,
            margin: 0,
            transform: 'none',
            cursor: isDragging ? 'grabbing' : 'auto'
        } : {}
    };
}
