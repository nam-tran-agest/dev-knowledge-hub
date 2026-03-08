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
    Droplets,
    Flame,
    Wind,
    ChevronRight,
    Search
} from 'lucide-react';

const StatRow = ({ icon: Icon, label, value, subValue, progress = 70 }: { icon: any, label: string, value: string, subValue?: string, progress?: number }) => (
    <div className="group/stat flex flex-col gap-1.5 cursor-pointer">
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
                <div className="text-blue-400 group-hover/stat:text-blue-300 transition-colors drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover/stat:text-slate-200 transition-colors">{label}</span>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white tracking-tight leading-none">{value}</span>
                </div>
                {subValue && <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">{subValue}</span>}
            </div>
        </div>
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
    </div>
);

const ArtifactCard = ({ label, value, substats, icon: Icon = Sparkles }: { label: string, value: string, substats: { label: string, val: string, icon?: any }[], icon?: any }) => (
    <div className="group/artifact relative bg-[#0a0a0c]/90 border border-white/5 rounded-[1.8rem] p-5 hover:border-blue-500/30 transition-all hover:translate-y-[-4px] backdrop-blur-3xl shadow-2xl min-h-[160px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-10 -mt-10" />
        <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-[#161824] border border-white/10 flex items-center justify-center text-blue-400 shadow-inner group-hover/artifact:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
        </div>
        <div className="mb-4 relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{value}</h3>
            <div className="flex gap-0.5 mt-2 items-center">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                <span className="text-[10px] font-black text-white ml-2 bg-blue-600/40 px-2 py-0.5 rounded-md">+20</span>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-white/5 relative z-10">
            {substats.map((sub, i) => (
                <div key={i} className="flex flex-col group/sub">
                    <div className="flex items-center gap-2 mb-0.5">
                        {sub.icon && <sub.icon className="w-3 h-3 text-blue-400/60 group-hover/sub:text-blue-400" />}
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{sub.label}</span>
                    </div>
                    <span className="text-[11px] font-black text-white group-hover/sub:text-blue-400 transition-colors">{sub.val}</span>
                </div>
            ))}
        </div>
    </div>
);

export const TemplateScannerView = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(SCANNER_TEMPLATES[0]);
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black tracking-tight text-white uppercase">{selectedTemplate.name}</h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simplifed Functional Mode</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <UploadCloud className="w-4 h-4" /> Upload
                        </button>
                        <button
                            onClick={loadSample}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" /> Load Sample
                        </button>
                        <button
                            onClick={onReset}
                            className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                            title="Reset All"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleUrlSubmit} className="flex-1 max-w-md w-full relative">
                    <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="Paste Matrix Image URL..."
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-5 pr-12 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500">
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
                        className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-950 border border-white/5 shadow-2xl group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {characterImage ? (
                            <img src={characterImage} alt="Portrait" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50 group-hover:bg-slate-900/80 transition-all">
                                <User className="w-24 h-24 text-white/5 mb-4" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Awaiting Matrix</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-8 left-8 right-8">
                            <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-2">{charName}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-blue-400 font-bold text-sm tracking-widest italic uppercase">{imagePreview ? 'Unit Syncing...' : 'System Offline'}</span>
                                {imagePreview && <div className="flex gap-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}</div>}
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl">
                                Replace Matrix Image
                            </div>
                        </div>
                    </div>

                    {/* Skill Icons */}
                    <div className="flex gap-4 px-2">
                        {[Wind, Sparkles, Flame].map((Icon, i) => (
                            <div key={i} className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:border-blue-500/50 transition-all cursor-pointer">
                                <Icon className="w-6 h-6" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Stats & Data (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* Stats Header */}
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Core Parameters</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border transition-all ${isEditing ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'}`}
                        >
                            {isEditing ? 'Save Changes' : 'Manual Edit'}
                        </button>
                    </div>

                    {/* Main Stats Card */}
                    <div className="bg-slate-900/40 rounded-3xl border border-white/5 p-8 shadow-xl flex flex-col gap-8">

                        {/* Weapon Preview */}
                        <div className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-white/5">
                                <Sword className="w-8 h-8 text-blue-500/50" />
                            </div>
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        className="bg-transparent text-lg font-black text-white w-full focus:outline-none border-b border-blue-500/20 mb-1"
                                        value={formValues['Weapon Name'] || ''}
                                        onChange={(e) => handleValueChange('Weapon Name', e.target.value)}
                                        placeholder="Enter Weapon Name..."
                                    />
                                ) : (
                                    <h4 className="text-lg font-black text-white">{formValues['Weapon Name'] || 'No Weapon Detected'}</h4>
                                )}
                                <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Lv. {formValues['Weapon Level'] || '??'} / 90</span>
                                    <span className="text-amber-500">{formValues['Refinement'] || 'R?'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
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
                                <div key={stat.key} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <stat.icon className="w-3 h-3 text-blue-500" />
                                            <span>{stat.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <input
                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-black text-white w-full focus:border-blue-500/50 focus:outline-none"
                                                value={formValues[stat.key] || ''}
                                                onChange={(e) => handleValueChange(stat.key, e.target.value)}
                                            />
                                        ) : (
                                            <span className="text-xl font-black text-white tracking-tight">{formValues[stat.key] || '---'}</span>
                                        )}
                                    </div>
                                    <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: formValues[stat.key] ? '70%' : '0%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Artifact Set */}
                        <div className="mt-4 pt-6 border-t border-white/5 text-center">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 block">Active Resonance Set</span>
                            {isEditing ? (
                                <input
                                    className="bg-transparent text-sm font-black text-white text-center w-full focus:outline-none border-b border-blue-500/20"
                                    value={formValues['Artifact Set'] || ''}
                                    onChange={(e) => handleValueChange('Artifact Set', e.target.value)}
                                    placeholder="Enter Artifact Set Name..."
                                />
                            ) : (
                                <h5 className="text-sm font-black text-white uppercase tracking-wider">{formValues['Artifact Set'] || '---'}</h5>
                            )}
                        </div>
                    </div>
                </div>

                {/* Horizontal Stat Ribbon */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 shadow-lg h-auto min-h-[4rem]">
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
                            <div className="text-blue-500 group-hover:scale-110 transition-transform">{s.icon}</div>
                            <span className="text-[11px] font-black text-white tracking-widest">{formValues[s.key] || '---'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scanning Overlay */}
            {isScanning && (
                <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin mb-8" />
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter animate-pulse mb-2">{statusText}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{scanProgress}% Analysis Complete</p>
                    <div className="w-64 h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs font-bold text-center uppercase tracking-widest">
                    {error}
                </div>
            )}

            {/* Plain Debug info for the user if they want to see what failed */}
            {result?.rawText && (
                <div className="mt-12 p-8 rounded-3xl bg-slate-900/20 border border-white/5">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4">OCR Raw Data Extract</h4>
                    <pre className="text-[10px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed opacity-40 hover:opacity-100 transition-opacity">
                        {result.rawText}
                    </pre>
                </div>
            )}
        </div>
    );
};
