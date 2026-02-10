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
                "size-2.5 rounded-full transition-all duration-300",
                isActive
                    ? cn("bg-primary scale-125", activeClassName)
                    : cn("bg-white/30 hover:bg-white/50", inactiveClassName)
            )}
            aria-label={isActive ? "Current slide" : "Go to slide"}
        />
    );
}
