import { ROIField } from '../config/section2-template';

/**
 * Loads an image from a data URL, string, or File object.
 */
export const loadImage = (src: string | File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;

        if (src instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) img.src = e.target.result as string;
            };
            reader.addEventListener('error', reject);
            reader.readAsDataURL(src);
        } else {
            img.src = src;
        }
    });
};

/**
 * Represents a logical bounding box (in absolute pixels)
 */
export interface BoundingBox {
    x0: number; // Left
    y0: number; // Top
    x1: number; // Right
    y1: number; // Bottom
}

/**
 * Calculates the percentage of a word's bounding box that falls inside a template's ROI bounding box.
 * Takes the word's Box, and the ROI's Box.
 * Returns a value between 0.0 and 1.0 representing how much of the word is inside the ROI.
 */
export const getIntersectionPercentage = (wordBox: BoundingBox, roiBox: BoundingBox): number => {
    // Find coordinates of intersection rectangle
    const xA = Math.max(wordBox.x0, roiBox.x0);
    const yA = Math.max(wordBox.y0, roiBox.y0);
    const xB = Math.min(wordBox.x1, roiBox.x1);
    const yB = Math.min(wordBox.y1, roiBox.y1);

    // Compute area of intersection rectangle
    const intersectionArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);

    // Compute area of the word's bounding box
    const wordArea = (wordBox.x1 - wordBox.x0) * (wordBox.y1 - wordBox.y0);

    if (wordArea === 0) return 0;

    // Return the percentage of the word that is inside the ROI
    return intersectionArea / wordArea;
};

/**
 * Converts a percentage-based ROI field into absolute pixels for a given image width/height.
 */
export const getAbsoluteROIBox = (field: ROIField, imgWidth: number, imgHeight: number): BoundingBox => {
    const x0 = (field.x / 100) * imgWidth;
    const y0 = (field.y / 100) * imgHeight;
    const width = (field.width / 100) * imgWidth;
    const height = (field.height / 100) * imgHeight;
    return {
        x0,
        y0,
        x1: x0 + width,
        y1: y0 + height
    };
};
