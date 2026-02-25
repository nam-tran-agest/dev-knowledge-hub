import { Shield, Star } from 'lucide-react';
import type { Armor, ArmorSet } from '../../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArmorCard } from '../armor-card';

interface ArmorSetsGridProps {
    sets: ArmorSet[];
    onSelectArmor: (a: Armor) => void;
}

export function ArmorSetsGrid({ sets, onSelectArmor }: ArmorSetsGridProps) {
    return (
        <Accordion type="multiple" className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {sets.map(set => {
                const bonusSkill = set.bonus || set.groupBonus;
                return (
                    <AccordionItem key={set.id} value={String(set.id)} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all border-b-0">
                        <AccordionTrigger className="px-4 py-4 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-bold text-white">{set.name}</h3>
                                    <p className="text-[10px] text-slate-500">{set.pieces?.length || 0} pieces</p>
                                </div>
                            </div>
                            {bonusSkill && (
                                <span className="text-[10px] bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-full px-2.5 py-1 font-bold mr-2">
                                    ✨ {bonusSkill.skill.name}
                                </span>
                            )}
                        </AccordionTrigger>
                        <AccordionContent>
                            {set.pieces && (
                                <div className="border-t border-white/5 bg-black/40 p-4 space-y-4">
                                    {bonusSkill && bonusSkill.ranks && (
                                        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-4 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                            <div className="flex items-center gap-2 mb-3">
                                                <Star className="w-4 h-4 text-purple-400" />
                                                <h4 className="text-xs text-purple-400 uppercase tracking-widest font-bold">Set Bonus — {bonusSkill.skill.name}</h4>
                                            </div>
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                                        {set.pieces.map((piece: Armor) => <ArmorCard key={piece.id} armor={piece} onClick={onSelectArmor} />)}
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
