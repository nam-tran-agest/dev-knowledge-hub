import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { X, Heart, MapPin, Shield, Swords, Target } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS, SPECIES_LABELS } from './monster-card';

interface MonsterDetailProps {
    monster: Monster;
    onClose: () => void;
}

function WeaknessSection({ monster }: { monster: Monster }) {
    const elementWeaknesses = monster.weaknesses.filter(w => w.kind === 'element');
    const statusWeaknesses = monster.weaknesses.filter(w => w.kind === 'status');

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-red-400" />
                Weaknesses
            </h4>
            {elementWeaknesses.length > 0 && (
                <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Elemental</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {elementWeaknesses.map((w) => {
                            const elName = w.element || '';
                            return (
                                <Badge
                                    key={w.id}
                                    className={`text-xs border ${ELEMENT_COLORS[elName] || 'bg-slate-500/15 text-slate-400'}`}
                                >
                                    {ELEMENT_ICONS[elName] || '○'} {elName}
                                    {w.level > 1 && <span className="ml-1 font-bold">★{w.level}</span>}
                                    {w.condition && <span className="ml-1 opacity-60">({w.condition})</span>}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
            {statusWeaknesses.length > 0 && (
                <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Status</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {statusWeaknesses.map((w) => {
                            const statusName = w.status || '';
                            return (
                                <Badge
                                    key={w.id}
                                    className={`text-xs border ${ELEMENT_COLORS[statusName] || 'bg-slate-500/15 text-slate-400'}`}
                                >
                                    {ELEMENT_ICONS[statusName] || '◆'} {statusName}
                                    {w.level > 1 && <span className="ml-1 font-bold">★{w.level}</span>}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function ResistanceSection({ monster }: { monster: Monster }) {
    if (monster.resistances.length === 0) return null;

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Resistances
            </h4>
            <div className="flex gap-1.5 flex-wrap">
                {monster.resistances.map((r) => {
                    const name = r.element || r.status || r.effect || '';
                    return (
                        <Badge
                            key={r.id}
                            className={`text-xs border ${ELEMENT_COLORS[name] || 'bg-slate-500/15 text-slate-400'}`}
                        >
                            {ELEMENT_ICONS[name] || '●'} {name}
                            {r.condition && <span className="ml-1 opacity-60">({r.condition})</span>}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}

function PartsTable({ monster }: { monster: Monster }) {
    if (monster.parts.length === 0) return null;

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                Hitzones
            </h4>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-slate-500 border-b border-white/5">
                            <th className="text-left py-2 pr-3 font-bold">Part</th>
                            <th className="text-center px-1.5 py-2 font-bold">✂ Cut</th>
                            <th className="text-center px-1.5 py-2 font-bold">🔨 Blunt</th>
                            <th className="text-center px-1.5 py-2 font-bold">🏹 Shot</th>
                            <th className="text-center px-1.5 py-2 font-bold">🔥</th>
                            <th className="text-center px-1.5 py-2 font-bold">💧</th>
                            <th className="text-center px-1.5 py-2 font-bold">⚡</th>
                            <th className="text-center px-1.5 py-2 font-bold">❄️</th>
                            <th className="text-center px-1.5 py-2 font-bold">🐉</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monster.parts.map((part) => (
                            <tr key={part.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                <td className="py-2 pr-3 text-slate-300 font-medium capitalize">
                                    {part.kind.replace(/-/g, ' ')}
                                </td>
                                <HitzoneCell value={part.multipliers.slash} />
                                <HitzoneCell value={part.multipliers.blunt} />
                                <HitzoneCell value={part.multipliers.pierce} />
                                <HitzoneCell value={part.multipliers.fire} isElement />
                                <HitzoneCell value={part.multipliers.water} isElement />
                                <HitzoneCell value={part.multipliers.thunder} isElement />
                                <HitzoneCell value={part.multipliers.ice} isElement />
                                <HitzoneCell value={part.multipliers.dragon} isElement />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function HitzoneCell({ value, isElement }: { value: number; isElement?: boolean }) {
    const displayValue = Math.round(value * 100);
    let color = 'text-slate-600';
    if (isElement) {
        if (value >= 0.25) color = 'text-emerald-400 font-bold';
        else if (value >= 0.15) color = 'text-yellow-400';
        else if (value >= 0.05) color = 'text-slate-400';
        else color = 'text-slate-700';
    } else {
        if (value >= 0.6) color = 'text-emerald-400 font-bold';
        else if (value >= 0.45) color = 'text-yellow-400';
        else if (value >= 0.25) color = 'text-slate-400';
        else color = 'text-slate-600';
    }

    return (
        <td className={`text-center px-1.5 py-2 ${color}`}>
            {displayValue}
        </td>
    );
}

function RewardsSection({ monster }: { monster: Monster }) {
    if (monster.rewards.length === 0) return null;

    // Group by rank
    const rewardsByRank: Record<string, typeof monster.rewards> = {};
    monster.rewards.forEach((reward) => {
        reward.conditions.forEach((cond) => {
            const rank = cond.rank || 'unknown';
            if (!rewardsByRank[rank]) rewardsByRank[rank] = [];
            // Avoid duplicates
            if (!rewardsByRank[rank].find(r => r.id === reward.id)) {
                rewardsByRank[rank].push(reward);
            }
        });
    });

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Rewards</h4>
            {Object.entries(rewardsByRank).map(([rank, rewards]) => (
                <div key={rank}>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 capitalize">{rank} Rank</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {rewards.slice(0, 8).map((reward) => (
                            <div key={reward.id} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2">
                                <span className="text-amber-400 text-xs">★{reward.item.rarity}</span>
                                <span className="text-xs text-slate-300 truncate">{reward.item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function MonsterDetail({ monster, onClose }: MonsterDetailProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative h-full w-full max-w-2xl bg-[#0a0a0c] border-l border-white/5 overflow-y-auto animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-white/5 p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{monster.name}</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {SPECIES_LABELS[monster.species] || monster.species}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Quick stats */}
                    <div className="flex gap-4 mt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-red-400" />
                            HP: {monster.baseHealth?.toLocaleString()}
                        </span>
                        {monster.locations?.length > 0 && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                {monster.locations.map(l => l.name).join(', ')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    {/* Description */}
                    <div>
                        <p className="text-sm text-slate-400 leading-relaxed">{monster.description}</p>
                    </div>

                    {/* Tips */}
                    {monster.tips && (
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-2">Hunter Tips</p>
                            <p className="text-sm text-slate-400 leading-relaxed">{monster.tips}</p>
                        </div>
                    )}

                    <WeaknessSection monster={monster} />
                    <ResistanceSection monster={monster} />
                    <PartsTable monster={monster} />
                    <RewardsSection monster={monster} />

                    {/* Variants */}
                    {monster.variants?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white">Variants</h4>
                            <div className="flex gap-2 flex-wrap">
                                {monster.variants.map((v) => (
                                    <Badge
                                        key={v.id}
                                        className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs capitalize"
                                    >
                                        {v.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
