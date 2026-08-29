'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTemplateScanner } from '../hooks/useTemplateScanner';
import { SCANNER_TEMPLATES } from '../config/section2-template';
import {
    Sword,
    Shield,
    Zap,
    Heart,
    Target,
    Sparkles,
    User,
    RotateCcw,
    UploadCloud,
    Link as LinkIcon,
    Star,
    Flame,
    Wind,
    Search
} from 'lucide-react';

export const TemplateScannerView = () => {
    const selectedTemplate = SCANNER_TEMPLATES[0];
    const {
        scanImageWithTemplate,
        isScanning,
        progress: scanProgress,
        statusText,
        result,
        error,
        resetScanner
    } = useTemplateScanner();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');
    const [formValues, setFormValues] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const characterImage = imagePreview;

    useEffect(() => {
        if (result && result.fields) {
            setFormValues(prev => ({ ...prev, ...result.fields }));
        }
    }, [result]);

    const processInput = useCallback((input: File | string) => {
        const previewUrl = typeof input === 'string' ? input : URL.createObjectURL(input);
        setImagePreview(previewUrl);
        setFormValues({});
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

    const onReset = () => {
        setImagePreview(null);
        setFormValues({});
        resetScanner();
        setIsEditing(false);
    };

    const loadSample = () => {
        setImagePreview('/skirk.png');
        setFormValues({
            'Character Name': 'Skirk',
            'HP': '18,500',
            'ATK': '2,242',
            'DEF': '930',
            'EM': '21',
            'Crit Rate': '81.1%',
            'Crit DMG': '205.0%',
            'ER': '100.0%',
            'Elemental Bonus': '61.6%',
            'Weapon Name': 'Thương Diệu',
            'Refinement': 'R1',
            'Weapon Level': '90',
            'Artifact Set': 'Đoạn Kết Hành Lang Sâu (4)'
        });
    };

    const handleValueChange = (key: string, val: string) => {
        setFormValues(prev => ({ ...prev, [key]: val }));
    };

    const charName = formValues['Character Name'] || (imagePreview ? 'UNIT ANALYZED' : 'PENDING TARGET');

    return (
        <div className="w-full max-w-[1200px] mx-auto py-12 px-6 animate-fade-in flex flex-col gap-10 text-slate-200">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.03] backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tight text-white uppercase">{selectedTemplate.name}</h2>
                        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">Simplified Functional Mode</span>
                    </div>
                    <div className="flex gap-2.5">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer"
                        >
                            <UploadCloud className="w-4 h-4" /> Upload
                        </button>
                        <button
                            onClick={loadSample}
                            className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Search className="w-4 h-4" /> Load Sample
                        </button>
                        <button
                            onClick={onReset}
                            className="text-slate-400 hover:text-rose-400 p-2.5 transition-colors cursor-pointer"
                            title="Reset All"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleUrlSubmit} className="flex-1 max-w-md w-full relative">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="Paste Matrix Image URL..."
                        className="w-full bg-[#07090e]/80 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-500"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 cursor-pointer">
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </form>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            {/* THE SIMPLIFIED CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Portrait Area (lg:col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div
                        className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#07090e] border border-white/10 shadow-2xl group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {characterImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={characterImage} alt="Portrait" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] group-hover:bg-white/[0.05] transition-all">
                                <User className="w-20 h-20 text-white/10 mb-4" />
                                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Awaiting Matrix</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-70" />

                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase leading-none mb-2">{charName}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-cyan-400 font-mono text-xs tracking-wider uppercase">{imagePreview ? 'Unit Syncing...' : 'System Offline'}</span>
                                {imagePreview && <div className="flex gap-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>}
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-white text-indigo-900 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl">
                                Replace Matrix Image
                            </div>
                        </div>
                    </div>

                    {/* Skill Icons */}
                    <div className="flex gap-3 px-1">
                        {[Wind, Sparkles, Flame].map((Icon, i) => (
                            <div key={i} className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-white/[0.06] transition-all cursor-pointer">
                                <Icon className="w-5 h-5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Stats & Data (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* Stats Header */}
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Core Parameters</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${isEditing ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'}`}
                        >
                            {isEditing ? 'Save Changes' : 'Manual Edit'}
                        </button>
                    </div>

                    {/* Main Stats Card */}
                    <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-7 shadow-2xl flex flex-col gap-7 backdrop-blur-2xl">

                        {/* Weapon Preview */}
                        <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="w-14 h-14 rounded-xl bg-[#07090e] flex items-center justify-center border border-white/10">
                                <Sword className="w-7 h-7 text-indigo-400/80" />
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        className="bg-transparent text-base font-bold text-white w-full focus:outline-none border-b border-indigo-500/40 mb-1"
                                        value={formValues['Weapon Name'] || ''}
                                        onChange={(e) => handleValueChange('Weapon Name', e.target.value)}
                                        placeholder="Enter Weapon Name..."
                                    />
                                ) : (
                                    <h4 className="text-base font-bold text-white">{formValues['Weapon Name'] || 'No Weapon Detected'}</h4>
                                )}
                                <div className="flex gap-4 text-xs font-mono text-slate-400">
                                    <span>Lv. {formValues['Weapon Level'] || '??'} / 90</span>
                                    <span className="text-amber-400 font-semibold">{formValues['Refinement'] || 'R?'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                            {[
                                { key: 'HP', icon: Heart, label: 'HP (Sinh Mệnh)' },
                                { key: 'ATK', icon: Sword, label: 'Tấn Công' },
                                { key: 'DEF', icon: Shield, label: 'Phòng Ngự' },
                                { key: 'EM', icon: Sparkles, label: 'Tinh Thông' },
                                { key: 'Crit Rate', icon: Target, label: 'Tỷ Lệ Bạo Kích' },
                                { key: 'Crit DMG', icon: Zap, label: 'ST Bạo Kích' },
                                { key: 'ER', icon: Zap, label: 'Hiệu Quả Nạp' },
                                { key: 'Elemental Bonus', icon: Sparkles, label: 'Tăng ST Nguyên Tố' },
                            ].map(stat => (
                                <div key={stat.key} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <stat.icon className="w-3.5 h-3.5 text-indigo-400" />
                                            <span>{stat.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <input
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm font-bold text-white w-full focus:border-indigo-500/50 focus:outline-none"
                                                value={formValues[stat.key] || ''}
                                                onChange={(e) => handleValueChange(stat.key, e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-lg font-bold text-white tracking-tight">{formValues[stat.key] || '---'}</span>
                                        )}
                                    </div>
                                    <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000" style={{ width: formValues[stat.key] ? '70%' : '0%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Artifact Set */}
                        <div className="mt-2 pt-5 border-t border-white/10 text-center">
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1.5 block">Active Resonance Set</span>
                            {isEditing ? (
                                <input
                                    className="bg-transparent text-sm font-bold text-white text-center w-full focus:outline-none border-b border-indigo-500/40"
                                    value={formValues['Artifact Set'] || ''}
                                    onChange={(e) => handleValueChange('Artifact Set', e.target.value)}
                                    placeholder="Enter Artifact Set Name..."
                                />
                            ) : (
                                <h5 className="text-sm font-bold text-white uppercase tracking-wider">{formValues['Artifact Set'] || '---'}</h5>
                            )}
                        </div>
                    </div>
                </div>

                {/* Horizontal Stat Ribbon */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 shadow-xl backdrop-blur-xl h-auto min-h-[4rem] lg:col-span-12">
                    {[
                        { key: 'HP', icon: <Heart className="w-4 h-4" /> },
                        { key: 'ATK', icon: <Sword className="w-4 h-4" /> },
                        { key: 'DEF', icon: <Shield className="w-4 h-4" /> },
                        { key: 'EM', icon: <Sparkles className="w-4 h-4" /> },
                        { key: 'Crit Rate', icon: <Target className="w-4 h-4" /> },
                        { key: 'Crit DMG', icon: <Zap className="w-4 h-4" /> },
                        { key: 'ER', icon: <Zap className="w-4 h-4" /> },
                        { key: 'Elemental Bonus', icon: <Wind className="w-4 h-4" /> },
                    ].map(s => (
                        <div key={s.key} className="flex items-center gap-2 group cursor-default">
                            <div className="text-indigo-400 group-hover:scale-110 transition-transform">{s.icon}</div>
                            <span className="text-xs font-mono font-bold text-white tracking-wider">{formValues[s.key] || '---'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scanning Overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-[100] bg-[#07090e]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin mb-6" />
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight animate-pulse mb-2">{statusText}</h3>
                    <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{scanProgress}% Analysis Complete</p>
                    <div className="w-64 h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${scanProgress}%` }} />
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-300 text-xs font-semibold text-center uppercase tracking-wider">
                    {error}
                </div>
            )}

            {/* Plain Debug info for the user if they want to see what failed */}
            {result?.rawText && (
                <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">OCR Raw Data Extract</h4>
                    <pre className="text-xs text-slate-500 font-mono whitespace-pre-wrap leading-relaxed opacity-40 hover:opacity-100 transition-opacity">
                        {result.rawText}
                    </pre>
                </div>
            )}
        </div>
    );
};
