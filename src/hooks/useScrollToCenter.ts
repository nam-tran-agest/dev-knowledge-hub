import { useRef, useCallback } from 'react';

export function useScrollToCenter<T extends HTMLElement>() {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Map<number, T>>(new Map());

    const setItemRef = useCallback((index: number) => (el: T | null) => {
        if (el) {
            itemsRef.current.set(index, el);
        } else {
            itemsRef.current.delete(index);
        }
    }, []);

    const scrollToCenter = useCallback((index: number) => {
        const container = containerRef.current;
        const item = itemsRef.current.get(index);

        if (container && item) {
            const containerWidth = container.offsetWidth;
            const itemLeft = item.offsetLeft;
            const itemWidth = item.offsetWidth;

            const scrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
            });
        }
    }, []);

    return { containerRef, setItemRef, scrollToCenter };
}
