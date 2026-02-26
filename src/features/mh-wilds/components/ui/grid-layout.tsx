import type { ReactNode } from 'react';

interface GridLayoutProps {
    children: ReactNode;
    /** Number of columns for xl breakpoint, default 3 */
    cols?: 2 | 3;
}

const GRID_COLS = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
    3: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
} as const;

export function GridLayout({ children, cols = 3 }: GridLayoutProps) {
    return <div className={GRID_COLS[cols]}>{children}</div>;
}
