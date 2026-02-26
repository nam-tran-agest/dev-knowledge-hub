import type { Armor, ArmorSet } from '../../types';
import { GridLayout } from '../ui/shared';
import { ArmorCard } from '../armor-card';
import { getArmorSetIconUrl } from '../../constants';

interface ArmorSetsGridProps {
    sets: ArmorSet[];
    onSelectArmor: (a: Armor) => void;
}

export function ArmorSetsGrid({ sets, onSelectArmor }: ArmorSetsGridProps) {
    return (
        <GridLayout>
            {sets.map(set => {
                const bonusSkill = set.bonus || set.groupBonus;
                return (
                    <div key={set.id} className="contents">
                        {/* Set header row */}
                        <div className="col-span-full flex items-center gap-3 pt-4 pb-2 first:pt-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getArmorSetIconUrl(set.pieces?.[0]?.rarity || 1)} alt={set.name} className="w-5 h-5 object-contain shrink-0" />
                            <h3 className="text-base font-bold text-white uppercase tracking-wider">{set.name}</h3>
                            {bonusSkill && (
                                <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-full px-2.5 py-0.5 font-bold">
                                    ✨ {bonusSkill.skill.name}
                                </span>
                            )}
                            <div className="flex-1 h-px bg-white/[0.06]" />
                            <span className="text-xs font-bold text-slate-600 bg-white/[0.03] rounded-full px-2 py-0.5">{set.pieces?.length || 0}</span>
                        </div>
                        {bonusSkill && bonusSkill.ranks && (
                            <div className="col-span-full bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-4 relative overflow-hidden mb-1">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                <h4 className="text-xs text-purple-400 uppercase tracking-widest font-bold mb-3">✨ Set Bonus — {bonusSkill.skill.name}</h4>
                                <div className="space-y-2">
                                    {bonusSkill.ranks.map(r => (
                                        <div key={r.id} className="flex gap-3 text-xs items-start bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                            <span className="text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded whitespace-nowrap">{r.pieces} pcs</span>
                                            <span className="text-slate-300 mt-0.5">{r.skill.description}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {set.pieces?.map((piece: Armor) => (
                            <ArmorCard key={piece.id} armor={piece} onClick={onSelectArmor} />
                        ))}
                    </div>
                );
            })}
        </GridLayout>
    );
}
