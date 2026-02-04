import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StrapiImageProps {
    documentId?: string;
    url?: string;
    alternativeText?: string;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
}

export const getStrapiMedia = (url: string | null | undefined) => {
    if (!url) return null;
    return url;
};

const StrapiImage: React.FC<StrapiImageProps> = ({
    documentId,
    url,
    alternativeText,
    className,
    width,
    height,
    fill
}) => {
    const imageUrl = getStrapiMedia(url);

    if (!imageUrl) return null;

    if (fill) {
        return (
            <Image
                src={imageUrl}
                alt={alternativeText || 'Image'}
                fill
                className={cn(className)}
            />
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alternativeText || 'Image'}
            width={width || 0}
            height={height || 0}
            sizes="100vw"
            className={cn("w-full h-auto", className)}
        />
    );
};

export default StrapiImage;
