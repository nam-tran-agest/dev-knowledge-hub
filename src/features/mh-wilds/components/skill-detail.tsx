import { Star } from 'lucide-react';
import type { Skill } from '../types';
import { SKILL_KIND_COLORS } from '../constants';
import { DrawerLayout, Section, DETAIL_PANEL_CLS } from './detail-drawers';

export function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
    return (
        <DrawerLayout
            title={skill.name}
            icon={<Star className="w-5 h-5 text-primary" />}
            subtitle={
                <span className={`text-[9px] cyber-clip-tag px-1.5 py-0.5 font-bold border uppercase font-mono ${SKILL_KIND_COLORS[skill.kind] || 'bg-primary/10 text-primary border-primary/30'}`}>
                    {skill.kind.replace('-', ' ')}
                </span>
            }
            onClose={onClose}
        >
            <p className={`text-primary/80 leading-relaxed text-xs font-mono ${DETAIL_PANEL_CLS}`}>// {skill.description}</p>

            <Section title={`SKILL PROGRESSION (MAX LV${skill.ranks.length})`}>
                <div className="relative pl-3 space-y-3 before:absolute before:inset-y-2 before:left-[17px] before:w-[2px] before:bg-primary/20 font-mono">
                    {skill.ranks.map((r, i) => (
                        <div key={r.id} className="relative flex items-start gap-3.5">
                            <div className="relative z-10 w-2.5 h-2.5 cyber-clip-sm bg-primary mt-2 shrink-0 shadow-[0_0_8px_var(--color-primary)]" />
                            <div className="flex-1 min-w-0 bg-[#04060f]/80 border border-primary/20 cyber-clip-button p-2.5 hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.2 cyber-clip-tag">LEVEL {r.level}</span>
                                    {i === skill.ranks.length - 1 && (
                                        <span className="text-[9px] uppercase tracking-wider font-bold text-black bg-primary px-1.5 py-0.2 cyber-clip-tag">MAX</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-200 leading-relaxed">{r.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </DrawerLayout>
    );
}
