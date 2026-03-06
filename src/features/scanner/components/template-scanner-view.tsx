'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTemplateScanner } from '../hooks/useTemplateScanner';
import { SCANNER_TEMPLATES } from '../config/section2-template';
import { UploadCloud, Link as LinkIcon, ImageIcon, Copy, CheckCircle2, RotateCcw } from 'lucide-react';

export const TemplateScannerView = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(SCANNER_TEMPLATES[0]);
    const {
        scanImageWithTemplate,
        isScanning,
        progress,
        statusText,
        result,
        error,
        resetScanner
    } = useTemplateScanner();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync OCR result to form values immediately upon completion
    useEffect(() => {
        if (result && result.fields) {
            console.log('[UI DEBUG] Syncing OCR result to form:', result.fields);
            setFormValues(result.fields);
        }
    }, [result]);

    // Cleanup blob URLs
    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const processInput = useCallback((input: File | string) => {
        const previewUrl = typeof input === 'string' ? input : URL.createObjectURL(input);
        setImagePreview(previewUrl);
        scanImageWithTemplate(input, selectedTemplate);
    }, [scanImageWithTemplate, selectedTemplate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processInput(file);
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlInput.trim()) {
            processInput(urlInput);
            setUrlInput('');
        }
    };

    // Paste listener (global)
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) processInput(file);
                    break;
                }
            }
        };
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [processInput]);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const onReset = () => {
        setImagePreview(null);
        setFormValues({});
        resetScanner();
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 min-h-[80vh] pt-32 p-6 animate-fade-in-up">

            {/* Left: Input & Image Preview */}
            <div className="flex-[1.2] rounded-3xl bg-white/[0.02] border border-white/5 p-6 shadow-2xl backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[500px]">

                {/* Template Switcher */}
                {!imagePreview && (
                    <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                        {SCANNER_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTemplate.id === t.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                )}

                {imagePreview ? (
                    <div className="w-full h-full flex items-center justify-center relative rounded-2xl overflow-hidden group/preview">
                        <div className="relative inline-block max-w-full">
                            <img src={imagePreview} alt="Preview" className="max-h-[65vh] rounded-xl shadow-2xl border border-white/5" />

                            {/* ROI Bounding Boxes (Subtle) */}
                            {selectedTemplate.fields.map(field => (
                                <div
                                    key={field.id}
                                    className="absolute border border-blue-500/20 bg-blue-500/[0.02] rounded-sm transition-all hover:border-blue-500/50 hover:bg-blue-500/10 pointer-events-none"
                                    style={{
                                        left: `${field.x}%`,
                                        top: `${field.y}%`,
                                        width: `${field.width}%`,
                                        height: `${field.height}%`
                                    }}
                                >
                                    <span className="absolute -top-3.5 left-0 text-[8px] font-black text-blue-500/30 uppercase tracking-tighter">
                                        {field.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Reset Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button onClick={onReset} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2 transition-all">
                                <RotateCcw className="w-4 h-4" /> Reset & Scan New
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processInput(f); }}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-full h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/5 rounded-3xl hover:bg-white/[0.01] transition-all"
                    >
                        <UploadCloud className="w-16 h-16 text-blue-500/10 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Upload Fixed-Format Document</h3>
                        <p className="text-slate-500 text-sm mb-10 max-w-sm">
                            Drop an image or use the options below. Best results with high-resolution, clear photos.
                        </p>

                        <div className="flex flex-col w-full max-w-sm gap-4">
                            <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">
                                Select Document Image
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                            <div className="flex items-center gap-4 my-4 opacity-10">
                                <div className="flex-1 h-px bg-white" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">or</span>
                                <div className="flex-1 h-px bg-white" />
                            </div>

                            <form onSubmit={handleUrlSubmit} className="relative">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={e => setUrlInput(e.target.value)}
                                    placeholder="Paste Image URL here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                                />
                                <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Extracted Data Fields */}
            <div className="flex-[0.8] rounded-3xl bg-white/[0.02] border border-white/5 p-8 shadow-2xl backdrop-blur-3xl flex flex-col gap-8">
                <div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2 tracking-tighter">Extracted Data</h2>
                    <p className="text-slate-500 text-sm font-medium">Review, edit and copy your results below.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold leading-relaxed whitespace-pre-wrap">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-5 relative min-h-[100px]">
                    {isScanning && (
                        <div className="absolute inset-0 z-20 bg-[#0a0a0c]/90 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl border border-white/10 shadow-inner">
                            <div className="w-12 h-12 rounded-full border-2 border-blue-500/10 border-t-blue-500 animate-spin mb-6 shadow-glow-blue" />
                            <p className="text-sm font-black text-white uppercase tracking-widest">{statusText}</p>
                            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                                <div className="h-full bg-blue-500 transition-all duration-300 shadow-glow-blue" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

                    {selectedTemplate.fields.map(field => {
                        const val = formValues[field.id] || '';
                        return (
                            <div key={field.id} className="group bg-white/[0.01] border border-white/5 p-5 rounded-3xl flex flex-col gap-2 focus-within:border-white/20 transition-all hover:bg-white/[0.02]">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{field.label}</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={e => setFormValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                                        placeholder="..."
                                        className="w-full bg-transparent text-white text-xl font-bold outline-none placeholder:text-slate-800 focus:text-blue-400 transition-colors"
                                        disabled={isScanning}
                                    />
                                    {val && (
                                        <button
                                            onClick={() => copyToClipboard(val, field.id)}
                                            className="p-3 opacity-0 group-hover:opacity-100 hover:bg-white/5 rounded-2xl transition-all"
                                            title="Copy to clipboard"
                                        >
                                            {copiedField === field.id ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-700" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Raw OCR Debug View */}
                    {result?.rawText && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                Image Raw Text (Debug)
                            </h4>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-[11px] text-slate-500 font-mono leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar select-all whitespace-pre-wrap">
                                {result.rawText}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden Debug: Raw Text (Visible only if you know where to look or via console) */}
                <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2">
                    <p className="text-[8px] text-slate-800 uppercase tracking-widest font-black text-center">
                        Tesseract.js Engine v7.0.0 (Local Context)
                    </p>
                </div>
            </div>
        </div>
    );
};
