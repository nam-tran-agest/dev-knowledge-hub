import type { Monster } from '../types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, Swords } from 'lucide-react';

const ELEMENT_COLORS: Record<string, string> = {
    fire: 'bg-red-500/20 text-red-400 border-red-500/30',
    water: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    thunder: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dragon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    poison: 'bg-green-500/20 text-green-400 border-green-500/30',
    sleep: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    paralysis: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    blast: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    stun: 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30',
};

const ELEMENT_ICONS: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    thunder: '⚡',
    ice: '❄️',
    dragon: '🐉',
    poison: '☠️',
    sleep: '😴',
    paralysis: '⚡',
    blast: '💥',
};

const SPECIES_LABELS: Record<string, string> = {
    'flying-wyvern': 'Flying Wyvern',
    'brute-wyvern': 'Brute Wyvern',
    'fanged-wyvern': 'Fanged Wyvern',
    'piscine-wyvern': 'Piscine Wyvern',
    'bird-wyvern': 'Bird Wyvern',
    'elder-dragon': 'Elder Dragon',
    'herbivore': 'Herbivore',
    'fanged-beast': 'Fanged Beast',
    'leviathan': 'Leviathan',
    'temnoceran': 'Temnoceran',
    'neopteron': 'Neopteron',
    'carapaceon': 'Carapaceon',
};

interface MonsterCardProps {
    monster: Monster;
    onClick: (monster: Monster) => void;
}

export function MonsterCard({ monster, onClick }: MonsterCardProps) {
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
                    <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://monsterhunterwiki.org/wiki/Special:FilePath/MHWilds-${monster.name.replace(/ /g, '_')}_Icon.webp`}
                            alt={monster.name}
                            className="w-[120%] h-[120%] object-contain opacity-90 drop-shadow-md"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.innerHTML = '<span class="text-2xl opacity-50">🐉</span>';
                                }
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                    {monster.name}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {SPECIES_LABELS[monster.species] || monster.species}
                                </p>
                            </div>
                            <Badge
                                className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${monster.kind === 'large'
                                    ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                                    }`}
                            >
                                {monster.kind}
                            </Badge>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {monster.description}
                </p>
            </div>

            {/* Weaknesses */}
            {weakElements.length > 0 && (
                <div className="px-5 pb-3">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Weaknesses</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {weakElements.map((w) => {
                            const elName = w.element || '';
                            return (
                                <Badge
                                    key={w.id}
                                    className={`text-xs border ${ELEMENT_COLORS[elName] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}
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
            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    {monster.baseHealth?.toLocaleString() || '???'}
                </span>
                {monster.locations?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {monster.locations.map(l => l.name).join(', ')}
                    </span>
                )}
                {monster.variants?.length > 0 && (
                    <span className="flex items-center gap-1.5 ml-auto">
                        <Swords className="w-3.5 h-3.5 text-amber-400" />
                        {monster.variants.length} variant{monster.variants.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>
        </button>
    );
}

export { ELEMENT_COLORS, ELEMENT_ICONS, SPECIES_LABELS };
