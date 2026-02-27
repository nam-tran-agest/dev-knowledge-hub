import type { Skill } from '../types';
import { Star } from 'lucide-react';
import { CARD_CLS, SKILL_KIND_COLORS } from '../constants';

export function SkillCard({ skill, onClick }: { skill: Skill; onClick?: (s: Skill) => void }) {
    const maxLevel = skill.ranks.length;

    return (
        <div
            className={`${CARD_CLS} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={() => onClick?.(skill)}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                            <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{skill.name}</h3>
                            <span className={`text-xs rounded px-1.5 py-0.5 font-bold border capitalize ${SKILL_KIND_COLORS[skill.kind] || 'bg-white/5 text-slate-400 border-white/5'}`}>
                                {skill.kind.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">Lv{maxLevel}</span>
                </div>

                {/* Level dots */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                        {Array.from({ length: maxLevel }).map((_, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        ))}
                        {Array.from({ length: Math.max(0, 7 - maxLevel) }).map((_, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/[0.05]" />
                        ))}
                    </div>
                </div>

                {/* Description preview */}
                <p className="text-sm text-slate-500 line-clamp-2">{skill.description}</p>
            </div>
        </div>
    );
}
