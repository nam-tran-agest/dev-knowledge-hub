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
                "h-1.5 transition-all duration-300 cyber-clip-sm cursor-pointer",
                isActive
                    ? cn("w-6 bg-primary shadow-[0_0_10px_var(--color-primary)]", activeClassName)
                    : cn("w-2.5 bg-primary/20 hover:bg-primary/50", inactiveClassName)
            )}
            aria-label={isActive ? "Current slide" : "Go to slide"}
        />
    );
}
