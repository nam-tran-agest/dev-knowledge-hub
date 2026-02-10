'use client';

import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface CTAButtonProps extends Omit<ButtonProps, 'asChild'> {
    /** Link URL - if provided, renders as Link */
    href?: string;
    /** Button label text */
    label: string;
    /** Show arrow icon */
    showArrow?: boolean;
    /** Custom icon (replaces arrow) */
    icon?: LucideIcon;
    /** Icon position */
    iconPosition?: 'left' | 'right';
}

/**
 * CTA Button - Unified call-to-action button component
 * 
 * @example
 * // As link
 * <CTAButton href="/contact" label="Contact Us" />
 * 
 * // As button with custom variant
 * <CTAButton label="Submit" variant="ctaOutline" onClick={handleSubmit} />
 */
export function CTAButton({
    href,
    label,
    showArrow = true,
    icon: Icon,
    iconPosition = 'right',
    variant = 'cta',
    size = 'lg',
    className,
    ...props
}: CTAButtonProps) {
    const IconComponent = Icon || (showArrow ? ArrowRight : null);

    const content = (
        <>
            {iconPosition === 'left' && IconComponent && (
                <IconComponent className="w-4 h-4" />
            )}
            {label}
            {iconPosition === 'right' && IconComponent && (
                <IconComponent className="w-4 h-4" />
            )}
        </>
    );

    if (href) {
        return (
            <Button
                asChild
                variant={variant}
                size={size}
                className={cn("gap-2 px-8", className)}
                {...props}
            >
                <Link href={href}>{content}</Link>
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn("gap-2 px-8", className)}
            {...props}
        >
            {content}
        </Button>
    );
}

// Legacy export for backwards compatibility
export const CTABtnV2 = CTAButton;
