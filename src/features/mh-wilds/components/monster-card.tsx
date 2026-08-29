'use client';

import { useState } from 'react';
import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Swords } from 'lucide-react';
import { ELEMENT_COLORS, ELEMENT_ICONS, SPECIES_LABELS, CARD_CLS, getMonsterIconUrl } from '../constants';

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
            className={`group ${CARD_CLS} flex flex-col h-full text-left font-mono`}
        >
            {/* Top Corner Bracket */}
            <div className="absolute top-0 right-4 px-2 bg-background border-x border-primary/30 text-[8px] uppercase tracking-widest text-primary/70 font-mono z-20">
                // TARGET_{monster.id}
            </div>

            {/* Header */}
            <div className="p-4 pb-2">
                <div className="flex items-start gap-3 mb-2.5">
                    <div className="w-14 h-14 cyber-clip-button bg-primary/5 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {imgError ? (
                            <span className="text-xl opacity-50">🐉</span>
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={getMonsterIconUrl(monster.name)}
                                alt={monster.name}
                                className="w-[110%] h-[110%] object-contain opacity-90 drop-shadow-md"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate uppercase">
                                    {monster.name}
                                </h3>
                                <p className="text-[10px] text-primary/60 mt-0.5 uppercase">
                                    // {SPECIES_LABELS[monster.species] || monster.species}
                                </p>
                            </div>
                            <Badge
                                className={`shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider ${monster.kind === 'large'
                                    ? 'bg-destructive/15 text-destructive border-destructive/30'
                                    : 'bg-primary/10 text-primary/70 border-primary/30'
                                    }`}
                            >
                                {monster.kind}
                            </Badge>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-primary/60 line-clamp-2 leading-relaxed mb-3 font-mono">
                    {monster.description}
                </p>
            </div>

            {/* Weaknesses */}
            {weakElements.length > 0 && (
                <div className="px-4 pb-2.5">
                    <p className="text-[9px] text-primary/70 uppercase tracking-widest font-bold mb-1.5">// WEAKNESS_MATRIX</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {weakElements.map((w) => {
                            const elName = w.element || '';
                            return (
                                <Badge
                                    key={w.id}
                                    className={`text-[10px] font-mono border ${ELEMENT_COLORS[elName] || 'bg-primary/10 text-primary border-primary/30'}`}
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
            <div className="px-4 py-2.5 border-t border-primary/20 flex items-center gap-3 text-xs text-primary/60 mt-auto font-mono">
                <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-destructive" />
                    {monster.baseHealth?.toLocaleString() || '???'}
                </span>
                {monster.locations?.length > 0 && (
                    <span className="flex items-center gap-1 truncate max-w-[130px]">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {monster.locations.map(l => l.name).join(', ')}
                    </span>
                )}
                {monster.variants?.length > 0 && (
                    <span className="flex items-center gap-1 ml-auto">
                        <Swords className="w-3.5 h-3.5 text-amber-400" />
                        {monster.variants.length}V
                    </span>
                )}
            </div>
        </button>
    );
}
