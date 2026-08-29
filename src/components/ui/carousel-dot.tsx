import { cn } from '@/lib/utils';

interface CarouselDotProps {
    isActive: boolean;
    onClick?: () => void;
    activeClassName?: string;
    inactiveClassName?: string;
}

export default function CarouselDot({
    isActive,
    onClick,
    activeClassName,
    inactiveClassName
}: CarouselDotProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "h-2.5 transition-all duration-300 cyber-clip-sm cursor-pointer border",
                isActive
                    ? cn("w-10 bg-primary border-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.9)] opacity-100", activeClassName)
                    : cn("w-5 bg-slate-800/90 border-primary/40 hover:border-primary hover:bg-primary/30 opacity-70 hover:opacity-100", inactiveClassName)
            )}
            aria-label={isActive ? "Current slide" : "Go to slide"}
        />
    );
}
