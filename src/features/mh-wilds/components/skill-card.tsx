import type { Skill } from '../types';
import { Star } from 'lucide-react';
import { CARD_CLS, SKILL_KIND_COLORS } from '../constants';

export function SkillCard({ skill, onClick }: { skill: Skill; onClick?: (s: Skill) => void }) {
    const maxLevel = skill.ranks.length;

    return (
        <div
            className={`${CARD_CLS} ${onClick ? 'cursor-pointer' : ''} font-mono`}
            onClick={() => onClick?.(skill)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-9 h-9 cyber-clip-button bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                            <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate uppercase group-hover:text-primary transition-colors">{skill.name}</h3>
                            <span className={`text-[9px] cyber-clip-tag px-1.5 py-0.5 font-bold border uppercase ${SKILL_KIND_COLORS[skill.kind] || 'bg-primary/10 text-primary/70 border-primary/30'}`}>
                                {skill.kind.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-primary">Lv{maxLevel}</span>
                </div>

                {/* Level dots */}
                <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex gap-1">
                        {Array.from({ length: maxLevel }).map((_, i) => (
                            <div key={i} className="w-2 h-2 cyber-clip-sm bg-primary shadow-[0_0_6px_var(--color-primary)]" />
                        ))}
                        {Array.from({ length: Math.max(0, 7 - maxLevel) }).map((_, i) => (
                            <div key={i} className="w-2 h-2 cyber-clip-sm bg-primary/10 border border-primary/20" />
                        ))}
                    </div>
                </div>

                {/* Description preview */}
                <p className="text-xs text-primary/60 line-clamp-2">{skill.description}</p>
            </div>
        </div>
    );
}
