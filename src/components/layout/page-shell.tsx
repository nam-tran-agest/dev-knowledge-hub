import { cn } from "@/lib/utils";

interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'landing' | 'centered';
    containerClassName?: string;
}

export function PageShell({
    children,
    className,
    variant = 'default',
    containerClassName,
    ...props
}: PageShellProps) {
    const isLanding = variant === 'landing';
    const isCentered = variant === 'centered';

    return (
        <div
            className={cn(
                "min-h-screen w-full",
                // Default adds top padding for fixed header, landing is full bleed
                !isLanding && "pt-20",
                className
            )}
            {...props}
        >
            {isLanding ? (
                children
            ) : (
                <div
                    className={cn(
                        "mx-auto h-full",
                        // Container constraints
                        "px-4 sm:px-6 lg:px-8",
                        variant === 'default' && "max-w-7xl",
                        isCentered && "max-w-3xl flex flex-col items-center",
                        containerClassName
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
