import { useMemo } from 'react';
import type { Charm } from '../../types';
import { GridLayout } from '../ui/shared';
import { getCharmIconUrl } from '../../constants';

export function CharmsList({ charms }: { charms: Charm[] }) {
    const groupedCharms = useMemo(() => {
        const romanNumeralRegex = /\s(I|II|III|IV|V|VI|VII|VIII|IX|X)$/;
        const map = new Map<string, { baseName: string, allRanks: typeof charms[0]['ranks'] }>();

        charms.forEach(charm => {
            charm.ranks.forEach(rank => {
                const baseName = rank.name.replace(romanNumeralRegex, '');
                if (!map.has(baseName)) {
                    map.set(baseName, { baseName, allRanks: [] });
                }
                map.get(baseName)!.allRanks.push(rank);
            });
        });

        const sortedGroups = Array.from(map.values()).sort((a, b) => a.baseName.localeCompare(b.baseName));
        sortedGroups.forEach(group => {
            group.allRanks.sort((a, b) => a.level - b.level);
        });

        return sortedGroups;
    }, [charms]);

    return (
        <GridLayout>
            {groupedCharms.map((group) => {
                const maxRank = group.allRanks[group.allRanks.length - 1];
                return (
                    <div key={group.baseName} className="bg-[#111114] border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all card-group cursor-pointer flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3 shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={getCharmIconUrl(maxRank?.rarity || 1)} alt={group.baseName} className="w-6 h-6 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{group.baseName}</h3>
                                <p className="text-xs text-slate-500">{group.allRanks.length} {group.allRanks.length === 1 ? 'rank' : 'ranks'}</p>
                            </div>
                        </div>
                        {/* Rank progression visual */}
                        <div className="space-y-1 mb-3 flex-1 flex flex-col justify-end">
                            {group.allRanks.map(r => (
                                <div key={r.id} className="flex items-center gap-2">
                                    <span className="text-xs text-emerald-400 font-bold w-5 text-center">{r.level}</span>
                                    <div className="flex-1 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: `${(r.level / 5) * 100}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-500 truncate max-w-[120px]">{r.name}</span>
                                </div>
                            ))}
                        </div>
                        {maxRank?.skills?.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mt-auto pt-3 border-t border-white/5">
                                {maxRank.skills.map(sk => (
                                    <span key={sk.id} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2 py-0.5 font-bold">
                                        {sk.skill.name} Lv{sk.level}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </GridLayout>
    );
}
