'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Armor } from '../types';
import { Badge } from '@/components/ui/badge';

const ARMOR_KIND_ICONS: Record<string, string> = {
    head: '🪖',
    chest: '🛡️',
    arms: '🧤',
    waist: '🩱',
    legs: '👢',
};

const ELEMENT_RES_COLORS = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-600',
};

interface ArmorCardProps {
    armor: Armor;
    onClick?: (a: Armor) => void;
}

export function ArmorCard({ armor, onClick }: ArmorCardProps) {
    const [open, setOpen] = useState(false);
    const kindIcon = ARMOR_KIND_ICONS[armor.kind] || '🛡️';

    const resEntries = [
        { key: 'fire', icon: '🔥', value: armor.resistances.fire },
        { key: 'water', icon: '💧', value: armor.resistances.water },
        { key: 'thunder', icon: '⚡', value: armor.resistances.thunder },
        { key: 'ice', icon: '❄️', value: armor.resistances.ice },
        { key: 'dragon', icon: '🐉', value: armor.resistances.dragon },
    ];

    return (
        <div className="bg-[#111114] border border-white/5 rounded-xl hover:border-emerald-500/50 transition-[border-color,box-shadow] duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
            {/* Header — click to toggle */}
            <button
                type="button"
                className="w-full flex items-center justify-between gap-2 px-5 py-4 text-left"
                onClick={() => setOpen((v) => !v)}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white truncate">{armor.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {kindIcon} {armor.kind} · {armor.armorSet?.name}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 capitalize">
                            {armor.rank}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-500">R{armor.rarity}</span>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Collapsible body */}
            {open && (
                <div
                    className="px-5 pb-5 border-t border-white/5 cursor-pointer"
                    onClick={() => onClick?.(armor)}
                >
                    {/* Defense */}
                    <div className="grid grid-cols-2 gap-2 mb-3 mt-3">
                        <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Defense</p>
                            <p className="text-sm font-bold text-white mt-0.5">{armor.defense.base}</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Max Def</p>
                            <p className="text-sm font-bold text-white mt-0.5">{armor.defense.max}</p>
                        </div>
                    </div>

                    {/* Elemental resistances */}
                    <div className="flex gap-3 mb-3">
                        {resEntries.map((res) => (
                            <div key={res.key} className="flex items-center gap-1 text-xs">
                                <span>{res.icon}</span>
                                <span className={
                                    res.value > 0
                                        ? ELEMENT_RES_COLORS.positive
                                        : res.value < 0
                                            ? ELEMENT_RES_COLORS.negative
                                            : ELEMENT_RES_COLORS.neutral
                                }>
                                    {res.value > 0 ? '+' : ''}{res.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    {armor.skills.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-3">
                            {armor.skills.map((sk) => (
                                <Badge key={sk.id} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {sk.skill.name} Lv{sk.level}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Slots */}
                    {armor.slots.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="font-bold">Slots:</span>
                            {armor.slots.map((s, i) => (
                                <span key={i} className="bg-white/[0.05] rounded px-1.5 py-0.5 font-bold text-slate-300">
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
