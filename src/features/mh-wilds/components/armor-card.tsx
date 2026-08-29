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
            className={`${CARD_CLS} ${onClick ? 'cursor-pointer' : ''} font-mono`}
            onClick={() => onClick?.(armor)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getArmorKindIconUrl(armor.kind, armor.rarity)} alt={armor.kind} className="w-5 h-5 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate uppercase group-hover:text-primary transition-colors">{armor.name}</h3>
                            <p className="text-[10px] text-primary/60 mt-0.5 uppercase">// {armor.kind} · {armor.armorSet?.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="text-[9px] bg-primary/15 text-primary border border-primary/30 uppercase">{armor.rank}</Badge>
                        <span className="text-[10px] font-bold text-primary/60">R{armor.rarity}</span>
                    </div>
                </div>

                {/* Defense stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`${STAT_BOX_CLS} px-2.5 py-1.5 text-center`}>
                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">DEF</p>
                        <p className="text-xs font-bold text-white mt-0.5">{armor.defense.base}</p>
                    </div>
                    <div className={`${STAT_BOX_CLS} px-2.5 py-1.5 text-center`}>
                        <p className="text-[9px] text-primary/60 uppercase tracking-widest font-bold">MAX_DEF</p>
                        <p className="text-xs font-bold text-white mt-0.5">{armor.defense.max}</p>
                    </div>
                </div>

                {/* Elemental resistances */}
                <div className="flex gap-2.5 mb-3">
                    {resEntries.map((res) => (
                        <div key={res.key} className="flex items-center gap-0.5 text-xs">
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
                    <div className="flex gap-1.5 flex-wrap pt-2.5 border-t border-primary/20">
                        {armor.skills.map((sk) => (
                            <Badge key={sk.id} className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/30">
                                {sk.skill.name} Lv{sk.level}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
