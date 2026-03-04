import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export interface ScanResult {
    text: string;
    confidence: number;
}

export const useScanner = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Provide the image as a File, Blob, URL string, or HTMLImageElement
    const scanImage = useCallback(async (imageInput: Tesseract.ImageLike) => {
        setIsScanning(true);
        setProgress(0);
        setStatusText('Initializing engine...');
        setResult(null);
        setError(null);

        try {
            const worker = await Tesseract.createWorker('eng+vie', 1, {
                logger: m => {
                    // m.status usually gives "loading tesseract core", "initializing api", "recognizing text", etc.
                    setStatusText(m.status);
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            });

            // Perform OCR
            setStatusText('Extracting text...');
            const { data } = await worker.recognize(imageInput);

            setResult({
                text: data.text,
                confidence: data.confidence
            });

            await worker.terminate();
            setStatusText('Complete');
            setIsScanning(false);

        } catch (err: unknown) {
            console.error('OCR Error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during text extraction.');
            setIsScanning(false);
        }
    }, []);

    const resetScanner = useCallback(() => {
        setIsScanning(false);
        setProgress(0);
        setStatusText('');
        setResult(null);
        setError(null);
    }, []);

    return {
        scanImage,
        isScanning,
        progress,
        statusText,
        result,
        error,
        resetScanner
    };
};
