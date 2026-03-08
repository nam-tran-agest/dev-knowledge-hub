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
            const normalizedRawText = normalizeText(rawText);
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

                if (field.width > 0 && field.height > 0) {
                    for (const word of allWords) {
                        const ratio = getIntersectionPercentage(word.bbox, roiBox);
                        if (ratio > 0.01) {
                            matches.push({
                                text: word.text,
                                x: word.bbox.x0,
                                y: word.bbox.y0
                            });
                        }
                    }
                }

                let combined = matches
                    .sort((a, b) => {
                        if (Math.abs(a.y - b.y) < 25) return a.x - b.x;
                        return a.y - b.y;
                    })
                    .map(m => m.text)
                    .join(' ')
                    .trim();

                // 4. SMART FALLBACK: Keyword Hunting
                if (!combined && field.keywords && field.keywords.length > 0) {
                    console.log(`[OCR DEBUG] ROI failed for ${field.id}. Trying keywords...`);

                    for (const kw of field.keywords) {
                        const normalizedKw = normalizeText(kw);
                        const escapedKw = normalizedKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        // Strategy A: Strict Regex on Normalized Text
                        const strictRegex = new RegExp(`${escapedKw}\\s*[:>\\-]*\\s*([\\d,\\.%+]+(?:\\s*\\+\\s*[\\d,\\.%+]+)?)`, 'i');
                        const strictMatch = normalizedRawText.match(strictRegex);

                        if (strictMatch && strictMatch[1]) {
                            combined = strictMatch[1].trim();
                            console.log(`[OCR DEBUG]   >> Strict Match (${kw}): "${combined}"`);
                            break;
                        }

                        // Strategy B: Bidirectional Proximity Search on Normalized Text
                        const kwIndex = normalizedRawText.toLowerCase().indexOf(normalizedKw.toLowerCase());
                        if (kwIndex !== -1) {
                            // Look ahead (100 chars) and behind (50 chars)
                            const start = Math.max(0, kwIndex - 50);
                            const end = Math.min(normalizedRawText.length, kwIndex + normalizedKw.length + 100);
                            const subText = normalizedRawText.substring(start, end);

                            // Regex for numbers, including those misread with 'o' for '0'
                            const proximityRegex = /([0-9oO,]{2,}(\.[0-9oO]+)?%?)/;
                            const proximityMatch = subText.match(proximityRegex);

                            if (proximityMatch) {
                                let val = proximityMatch[1].trim();
                                // Substitution for common OCR errors
                                val = val.replace(/[oO]/g, '0').replace(/[sS]/g, '5').replace(/[lI]/g, '1');
                                combined = val;
                                console.log(`[OCR DEBUG]   >> Proximity Match (${kw}): "${combined}"`);
                                break;
                            }
                        }

                        // Strategy C: Global Fuzzy Search (Context-aware)
                        if (field.id !== 'Weapon Name' && field.id !== 'Artifact Set' && field.id !== 'Character Name') {
                            const valueRegex = /([0-9oOsSlI,]{2,}(\.[0-9oOsSlI]+)?%?)/g;
                            let m;
                            while ((m = valueRegex.exec(normalizedRawText)) !== null) {
                                const valueIndex = m.index;
                                // If the value is within 150 chars of the keyword, it's a candidate
                                if (Math.abs(valueIndex - kwIndex) < 150) {
                                    let val = m[1].trim();
                                    val = val.replace(/[oO]/g, '0').replace(/[sS]/g, '5').replace(/[lI]/g, '1');
                                    combined = val;
                                    console.log(`[OCR DEBUG]   >> Global Fuzzy Match (${kw}): "${combined}"`);
                                    break;
                                }
                            }
                            if (combined) break;
                        }
                    }
                }

                // Final Cleanups for stats: remove all non-numeric/separator noise
                if (combined && (field.id === 'HP' || field.id === 'ATK' || field.id === 'DEF' || field.id === 'EM' || field.id.includes('Crit') || field.id === 'ER')) {
                    combined = combined.replace(/[^0-9,.%+]/g, '');
                    combined = combined.replace(/[.,]$/, '');
                }

                // Fallback for Name: usually one of the first lines if not ROI'd
                if (!combined && field.id === 'Character Name') {
                    const lines = rawText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2 && /[a-zA-Z]/.test(l));
                    combined = lines[0] || '';
                }

                fieldData[field.id] = combined;
            }

            const finalResult: TemplateScanResult = {
                fields: fieldData,
                rawText: rawText,
                words: allWords
            };

            // Snapshot for console debugging
            console.log('[OCR DEBUG] FINAL FIELD DATA:', fieldData);
            (window as any)._OCR_DEBUG = {
                templateId: template.id,
                dimensions: { width: imgW, height: imgH },
                result: finalResult,
                rawText: rawText,
                normalizedText: normalizedRawText
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

/**
 * Normalizes text for better OCR matching (removes Vietnamese accents, noise)
 */
function normalizeText(text: string): string {
    if (!text) return '';

    let normalized = text.toLowerCase();

    // Remove Vietnamese accents
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    normalized = normalized.replace(/[đð]/g, 'd');

    // Clean noisy symbols that often break OCR words
    normalized = normalized.replace(/[|\[\]{}()]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ');

    return normalized.trim();
}
