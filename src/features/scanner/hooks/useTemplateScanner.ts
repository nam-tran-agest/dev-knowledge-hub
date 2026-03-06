import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { ScannerTemplate } from '../config/section2-template';
import { loadImage, getAbsoluteROIBox, getIntersectionPercentage, BoundingBox } from '../utils/image-utils';

export interface OCRWord {
    text: string;
    bbox: BoundingBox;
}

export interface TemplateScanResult {
    fields: { [fieldId: string]: string };
    rawText: string;
    words: OCRWord[];
}

export const useTemplateScanner = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [result, setResult] = useState<TemplateScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const scanImageWithTemplate = useCallback(async (imageInput: string | File, template: ScannerTemplate) => {
        setIsScanning(true);
        setProgress(0);
        setStatusText('Starting Image Analysis...');
        setResult(null);
        setError(null);

        const startTime = Date.now();

        try {
            // 1. Load Image
            const img = await loadImage(imageInput);
            const imgW = img.naturalWidth || img.width;
            const imgH = img.naturalHeight || img.height;

            console.log(`[OCR DEBUG] Image Resolution: ${imgW}x${imgH}`);

            // 2. Run OCR
            const langs = template.id === 'credit-card' ? 'eng' : 'eng+vie';
            setStatusText(`Initializing ${langs} engine...`);

            const resultObj = (await Tesseract.recognize(img, langs, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setStatusText(`Scanning... ${Math.round(m.progress * 100)}%`);
                        setProgress(Math.round(m.progress * 100));
                    } else {
                        setStatusText(m.status.replace(/_/g, ' '));
                    }
                }
            })) as any;

            // Defensive parsing for Tesseract.js internal structures
            const data = resultObj.data || resultObj;
            console.log('[OCR DEBUG] Raw Result Keys:', Object.keys(resultObj));
            console.log(`[OCR DEBUG] Engine completed in ${Date.now() - startTime}ms`);

            if (!data || !data.words || data.words.length === 0) {
                console.warn('[OCR DEBUG] No words detected in original scan.');
                setStatusText('No text detected. Try a clearer photo.');
                setIsScanning(false);
                return;
            }

            const rawText = data.text || '';
            console.log(`[OCR DEBUG] Total Words found: ${data.words.length}`);
            console.log(`[OCR DEBUG] First 50 chars of raw text: "${rawText.substring(0, 50)}..."`);

            const allWords: OCRWord[] = data.words.map((w: any) => ({
                text: w.text,
                bbox: {
                    x0: w.bbox.x0,
                    y0: w.bbox.y0,
                    x1: w.bbox.x1,
                    y1: w.bbox.y1
                }
            }));

            const fieldData: Record<string, string> = {};

            // 3. Map Words to Template ROIs
            for (const field of template.fields) {
                const roiBox = getAbsoluteROIBox(field, imgW, imgH);
                const matches: { text: string; x: number; y: number }[] = [];

                // Debug: Log the ROI box in pixels
                console.log(`[OCR DEBUG] Field: "${field.label}" | Pixels: x=${roiBox.x0.toFixed(0)} y=${roiBox.y0.toFixed(0)} w=${(roiBox.x1 - roiBox.x0).toFixed(0)} h=${(roiBox.y1 - roiBox.y0).toFixed(0)}`);

                for (const word of allWords) {
                    const ratio = getIntersectionPercentage(word.bbox, roiBox);

                    // Very permissive threshold (1%) to capture ANY overlap for debugging
                    if (ratio > 0.01) {
                        console.log(`[OCR DEBUG]   >> Match: "${word.text}" (Overlaps ${Math.round(ratio * 100)}%)`);
                        matches.push({
                            text: word.text,
                            x: word.bbox.x0,
                            y: word.bbox.y0
                        });
                    }
                }

                // Sorting: Rows then Columns
                const combined = matches
                    .sort((a, b) => {
                        if (Math.abs(a.y - b.y) < 25) return a.x - b.x;
                        return a.y - b.y;
                    })
                    .map(m => m.text)
                    .join(' ')
                    .trim();

                console.log(`[OCR DEBUG]   >> Final Value for ${field.id}: "${combined}"`);
                fieldData[field.id] = combined;
            }

            const finalResult: TemplateScanResult = {
                fields: fieldData,
                rawText: rawText,
                words: allWords
            };

            // Snapshot for console debugging
            (window as any)._OCR_DEBUG = {
                templateId: template.id,
                dimensions: { width: imgW, height: imgH },
                result: finalResult
            };

            setResult(finalResult);
            setStatusText(`Complete (${data.words.length} segments)`);
            setIsScanning(false);

        } catch (err: any) {
            console.error('[OCR DEBUG] Fatal Process Error:', err);
            setError(`Error: ${err?.message || 'The scan failed unexpectedly.'}`);
            setIsScanning(false);
        }
    }, [isScanning]);

    const resetScanner = useCallback(() => {
        setIsScanning(false);
        setProgress(0);
        setStatusText('');
        setResult(null);
        setError(null);
    }, []);

    return {
        scanImageWithTemplate,
        isScanning,
        progress,
        statusText,
        result,
        error,
        resetScanner
    };
};
