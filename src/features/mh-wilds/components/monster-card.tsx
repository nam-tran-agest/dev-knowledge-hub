import { useState } from 'react';
import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Swords } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS, SPECIES_LABELS, getMonsterIconUrl } from '../constants';

interface MonsterCardProps {
    monster: Monster;
    onClick: (monster: Monster) => void;
}

export function MonsterCard({ monster, onClick }: MonsterCardProps) {
    const [imgError, setImgError] = useState(false);

    const weakElements = monster.weaknesses
        .filter(w => w.kind === 'element')
        .sort((a, b) => b.level - a.level)
        .slice(0, 3);

    return (
        <button
            onClick={() => onClick(monster)}
            className="group text-left w-full bg-[#111114] border border-white/5 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
        >
            {/* Header */}
            <div className="p-5 pb-3">
                <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {imgError ? (
                            <span className="text-2xl opacity-50">🐉</span>
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={getMonsterIconUrl(monster.name)}
                                alt={monster.name}
                                className="w-[120%] h-[120%] object-contain opacity-90 drop-shadow-md"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                    {monster.name}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                    {SPECIES_LABELS[monster.species] || monster.species}
                                </p>
                            </div>
                            <Badge
                                className={`shrink-0 text-xs font-bold uppercase tracking-wider ${monster.kind === 'large'
                                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                                    }`}
                            >
                                {monster.kind}
                            </Badge>
                        </div>
                    </div>
                </div>

                <p className="text-base text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {monster.description}
                </p>
            </div>

            {/* Weaknesses */}
            {weakElements.length > 0 && (
                <div className="px-5 pb-3">
                    <p className="text-xs text-slate-600 uppercase tracking-widest font-bold mb-2">Weaknesses</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {weakElements.map((w) => {
                            const elName = w.element || '';
                            return (
                                <Badge
                                    key={w.id}
                                    className={`text-sm border ${ELEMENT_COLORS[elName] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}
                                >
                                    {ELEMENT_ICONS[elName] || '○'} {elName}
                                    {w.level > 1 && <span className="ml-1 opacity-70">×{w.level}</span>}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer stats */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-400" />
                    {monster.baseHealth?.toLocaleString() || '???'}
                </span>
                {monster.locations?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        {monster.locations.map(l => l.name).join(', ')}
                    </span>
                )}
                {monster.variants?.length > 0 && (
                    <span className="flex items-center gap-1.5 ml-auto">
                        <Swords className="w-4 h-4 text-amber-400" />
                        {monster.variants.length} variant{monster.variants.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>
        </button>
    );
}

