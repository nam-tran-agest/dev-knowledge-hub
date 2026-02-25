import { Star } from 'lucide-react';
import type { Skill } from '../../types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const kindColors: Record<string, string> = {
    armor: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    weapon: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    'set-bonus': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    'group-bonus': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
};

export function SkillsList({ skills }: { skills: Skill[] }) {
    return (
        <Accordion type="multiple" className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {skills.map(skill => {
                const maxLevel = skill.ranks.length;
                return (
                    <AccordionItem key={skill.id} value={String(skill.id)} className="bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all border-b-0">
                        <AccordionTrigger className="px-4 py-4 hover:no-underline">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-bold text-white truncate">{skill.name}</h3>
                                        <span className={`text-[10px] rounded px-1.5 py-0.5 font-bold border capitalize ${kindColors[skill.kind] || 'bg-white/5 text-slate-400 border-white/5'}`}>
                                            {skill.kind.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: maxLevel }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />
                                            ))}
                                            {Array.from({ length: Math.max(0, 7 - maxLevel) }).map((_, i) => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-white/[0.05]" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-500">Max Lv{maxLevel}</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="border-t border-white/5 bg-black/40 px-6 py-5">
                                <p className="text-sm text-slate-400 mb-6 italic border-l-2 border-emerald-500/30 pl-3">
                                    {skill.description}
                                </p>
                                <div className="relative pl-3 space-y-5 before:absolute before:inset-y-2 before:left-[17px] before:w-[2px] before:bg-white/5">
                                    {skill.ranks.map((r, i) => (
                                        <div key={r.id} className="relative flex items-start gap-4">
                                            <div className="relative z-10 w-[10px] h-[10px] rounded-full bg-emerald-500 border-[3px] border-[#111114] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                            <div className="flex-1 min-w-0 bg-white/[0.02] border border-white/5 rounded-lg p-3 hover:bg-white/[0.04] transition-colors">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                        Level {r.level}
                                                    </span>
                                                    {i === skill.ranks.length - 1 && (
                                                        <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 px-1.5 rounded">Max</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed">
                                                    {r.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
