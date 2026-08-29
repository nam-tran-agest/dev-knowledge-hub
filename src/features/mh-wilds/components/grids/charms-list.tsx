import { useMemo } from 'react';
import type { Charm } from '../../types';
import { GridLayout } from '../ui/shared';
import { CARD_CLS, getCharmIconUrl } from '../../constants';

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
                    <div key={group.baseName} className={`${CARD_CLS} p-4 flex flex-col h-full group font-mono`}>
                        <div className="flex items-start gap-3 mb-3 shrink-0">
                            <div className="w-10 h-10 cyber-clip-button bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={getCharmIconUrl(maxRank?.rarity || 1)} alt={group.baseName} className="w-5 h-5 object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors uppercase">{group.baseName}</h3>
                                <p className="text-[10px] text-primary/60 uppercase">// {group.allRanks.length} {group.allRanks.length === 1 ? 'rank' : 'ranks'}</p>
                            </div>
                        </div>
                        {/* Rank progression visual */}
                        <div className="space-y-1 mb-3 flex-1 flex flex-col justify-end">
                            {group.allRanks.map(r => (
                                <div key={r.id} className="flex items-center gap-2">
                                    <span className="text-[10px] text-primary font-bold w-4 text-center">{r.level}</span>
                                    <div className="flex-1 h-1 bg-[#04060f] cyber-clip-sm overflow-hidden border border-primary/20">
                                        <div className="h-full bg-primary" style={{ width: `${(r.level / 5) * 100}%` }} />
                                    </div>
                                    <span className="text-[10px] text-primary/60 truncate max-w-[120px] uppercase">{r.name}</span>
                                </div>
                            ))}
                        </div>
                        {maxRank?.skills?.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mt-auto pt-2.5 border-t border-primary/20">
                                {maxRank.skills.map(sk => (
                                    <span key={sk.id} className="text-[10px] bg-primary/10 text-primary border border-primary/30 cyber-clip-tag px-2 py-0.5 font-bold uppercase">
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
