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
                    <div key={set.id} className="contents font-mono">
                        {/* Set header row */}
                        <div className="col-span-full flex items-center gap-3 pt-4 pb-2 first:pt-0 border-b border-primary/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getArmorSetIconUrl(set.pieces?.[0]?.rarity || 1)} alt={set.name} className="w-5 h-5 object-contain shrink-0" />
                            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">{set.name}</h3>
                            {bonusSkill && (
                                <span className="text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">
                                    // {bonusSkill.skill.name}
                                </span>
                            )}
                            <div className="flex-1 h-px bg-primary/20" />
                            <span className="text-[10px] font-bold text-primary/70 bg-primary/10 border border-primary/30 cyber-clip-tag px-2 py-0.5">{set.pieces?.length || 0} PIECES</span>
                        </div>
                        {bonusSkill && bonusSkill.ranks && (
                            <div className="col-span-full bg-[#04060f]/80 border border-purple-500/30 cyber-clip p-4 relative overflow-hidden mb-2">
                                <h4 className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-2.5">// SET_BONUS_SYNERGY — {bonusSkill.skill.name}</h4>
                                <div className="space-y-1.5">
                                    {bonusSkill.ranks.map(r => (
                                        <div key={r.id} className="flex gap-2.5 text-xs items-start bg-purple-500/5 p-2 cyber-clip-button border border-purple-500/20">
                                            <span className="text-purple-300 font-bold bg-purple-500/20 px-1.5 py-0.5 cyber-clip-tag whitespace-nowrap text-[10px]">{r.pieces} PCS</span>
                                            <span className="text-slate-300 text-[11px] mt-0.5">{r.skill.description}</span>
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
