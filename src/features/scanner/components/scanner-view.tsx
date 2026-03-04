'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useScanner } from '../hooks/useScanner';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, Copy, CheckCircle2, RotateCcw, FileText } from 'lucide-react';

export const ScannerView = () => {
    const { scanImage, isScanning, progress, statusText, result, error, resetScanner } = useScanner();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Image Input Handlers ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const dataUrl = e.target.result as string;
                setImagePreview(dataUrl);
                scanImage(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    }, [scanImage]);

    // Paste listener (global)
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) processFile(file);
                    break;
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [processFile]);

    // Handle Drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!urlInput.trim()) return;
        setImagePreview(urlInput);
        scanImage(urlInput);
        setUrlInput('');
    };

    // --- Output Handlers ---
    const handleCopy = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleReset = () => {
        setImagePreview(null);
        setUrlInput('');
        resetScanner();
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh] pt-32 p-6 animate-fade-in-up">

            {/* LEFT COLUMN: Input & Preview */}
            <div className="flex-1 rounded-3xl bg-white/[0.02] border border-white/5 p-6 shadow-2xl backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[400px]">

                {imagePreview ? (
                    <div className="w-full h-full flex items-center justify-center relative">
                        <img
                            src={imagePreview}
                            alt="Scanned item"
                            className="max-h-[60vh] object-contain rounded-xl shadow-2xl"
                        />
                        {/* Reset Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-xl">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-white font-medium transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Scan Another Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="w-full h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-colors hover:border-white/20 hover:bg-white/[0.01]"
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                            <UploadCloud className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-2">Upload or Paste Image</h3>
                        <p className="text-slate-400 mb-8 max-w-sm">
                            Drag and drop an image here, press <kbd className="bg-white/10 px-2 py-1 rounded text-xs text-white">Ctrl+V</kbd> to paste, or click to browse.
                        </p>

                        <div className="flex flex-col w-full max-w-sm gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <ImageIcon className="w-5 h-5" />
                                Select File
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            <div className="flex items-center gap-4 text-slate-500 text-sm my-2">
                                <div className="flex-1 h-px bg-white/10"></div>
                                OR
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            <form onSubmit={handleUrlSubmit} className="relative">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="Paste image URL..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Output */}
            <div className="flex-[1.5] rounded-3xl bg-white/[0.02] border border-white/5 p-6 shadow-2xl backdrop-blur-3xl flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Text Extractor</h2>
                        <p className="text-slate-400 mt-1">English & Vietnamese supported (Tesseract OCR)</p>
                    </div>
                    {result && (
                        <div className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-medium border border-green-500/20">
                            Confidence: {Math.round(result.confidence)}%
                        </div>
                    )}
                </div>

                {isScanning ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0a0a0a]/50 border border-white/5">
                        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin mb-6"></div>
                        <h3 className="text-xl font-medium text-white mb-2">{statusText}</h3>
                        <div className="w-full max-w-sm h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-3">{progress}% extracting data...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-red-500/5 border border-red-500/20">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <span className="text-red-400 text-2xl">!</span>
                        </div>
                        <h3 className="text-lg font-medium text-red-400 mb-2">Extraction Failed</h3>
                        <p className="text-slate-400">{error}</p>
                    </div>
                ) : result?.text ? (
                    <div className="flex-1 flex flex-col min-h-[400px]">
                        <div className="flex-1 relative group">
                            <textarea
                                readOnly
                                value={result.text}
                                className="w-full h-full min-h-[300px] bg-[#0a0a0a]/50 border border-white/10 rounded-2xl p-6 text-white text-base leading-relaxed resize-none focus:outline-none focus:border-white/30 custom-scrollbar"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2.5 rounded-xl text-white backdrop-blur-md transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                title="Copy to clipboard"
                            >
                                {isCopied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-white/5 bg-transparent">
                        <FileText className="w-12 h-12 text-white/10 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">No content extracted yet</h3>
                        <p className="text-slate-500 max-w-sm">
                            Upload an image with text on the left pane to see the magic happen.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
