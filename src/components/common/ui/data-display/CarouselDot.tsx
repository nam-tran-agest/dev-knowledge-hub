import { cn } from '@/lib/utils';

interface CarouselDotProps {
    isActive: boolean;
    onClick?: () => void;
}

export default function CarouselDot({ isActive, onClick }: CarouselDotProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "size-2.5 rounded-full transition-all duration-300",
                isActive
                    ? "bg-primary scale-125"
                    : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={isActive ? "Current slide" : "Go to slide"}
        />
    );
}
