import { Star } from 'lucide-react';
import type { Skill } from '../types';
import { SKILL_KIND_COLORS } from '../constants';
import { DrawerLayout, Section, DETAIL_PANEL_CLS } from './detail-drawers';

export function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
    return (
        <DrawerLayout
            title={skill.name}
            icon={<Star className="w-6 h-6 text-yellow-400" />}
            subtitle={
                <span className={`text-[10px] rounded px-1.5 py-0.5 font-bold border capitalize ${SKILL_KIND_COLORS[skill.kind] || 'bg-white/5 text-slate-400 border-white/5'}`}>
                    {skill.kind.replace('-', ' ')}
                </span>
            }
            onClose={onClose}
        >
            <p className={`text-slate-300 leading-relaxed text-sm ${DETAIL_PANEL_CLS}`}>{skill.description}</p>

            <Section title={`Skill Levels (Max ${skill.ranks.length})`}>
                <div className="relative pl-3 space-y-4 before:absolute before:inset-y-2 before:left-[17px] before:w-[2px] before:bg-white/5">
                    {skill.ranks.map((r, i) => (
                        <div key={r.id} className="relative flex items-start gap-4">
                            <div className="relative z-10 w-[10px] h-[10px] rounded-full bg-emerald-500 border-[3px] border-[#0a0a0c] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                            <div className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 hover:bg-white/[0.06] transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Level {r.level}</span>
                                    {i === skill.ranks.length - 1 && (
                                        <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 px-1.5 rounded">Max</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{r.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </DrawerLayout>
    );
}
