import type { Armor } from '../types';
import { Badge } from '@/components/ui/badge';
import { ELEMENT_RES_COLORS, CARD_CLS, STAT_BOX_CLS, getArmorKindIconUrl } from '../constants';

interface ArmorCardProps {
    armor: Armor;
    onClick?: (a: Armor) => void;
}

export function ArmorCard({ armor, onClick }: ArmorCardProps) {
    const resEntries = [
        { key: 'fire', icon: '🔥', value: armor.resistances.fire },
        { key: 'water', icon: '💧', value: armor.resistances.water },
        { key: 'thunder', icon: '⚡', value: armor.resistances.thunder },
        { key: 'ice', icon: '❄️', value: armor.resistances.ice },
        { key: 'dragon', icon: '🐉', value: armor.resistances.dragon },
    ];

    return (
        <div
            className={`${CARD_CLS} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={() => onClick?.(armor)}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getArmorKindIconUrl(armor.kind, armor.rarity)} alt={armor.kind} className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{armor.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5 capitalize">{armor.kind} · {armor.armorSet?.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 capitalize">{armor.rank}</Badge>
                        <span className="text-xs font-bold text-slate-500">R{armor.rarity}</span>
                    </div>
                </div>

                {/* Defense stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`${STAT_BOX_CLS} px-3 py-2 text-center`}>
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">Defense</p>
                        <p className="text-base font-bold text-white mt-0.5">{armor.defense.base}</p>
                    </div>
                    <div className={`${STAT_BOX_CLS} px-3 py-2 text-center`}>
                        <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">Max Def</p>
                        <p className="text-base font-bold text-white mt-0.5">{armor.defense.max}</p>
                    </div>
                </div>

                {/* Elemental resistances */}
                <div className="flex gap-3 mb-3">
                    {resEntries.map((res) => (
                        <div key={res.key} className="flex items-center gap-1 text-sm">
                            <span>{res.icon}</span>
                            <span className={
                                res.value > 0 ? ELEMENT_RES_COLORS.positive
                                    : res.value < 0 ? ELEMENT_RES_COLORS.negative
                                        : ELEMENT_RES_COLORS.neutral
                            }>
                                {res.value > 0 ? '+' : ''}{res.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                {armor.skills.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap pt-3 border-t border-white/5">
                        {armor.skills.map((sk) => (
                            <Badge key={sk.id} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {sk.skill.name} Lv{sk.level}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
