import { Fragment } from 'react';
import type { Weapon } from '../../types';
import { WEAPON_KIND_LABELS } from '../../constants';
import { GroupHeader, GridLayout } from '../ui/shared';
import { WeaponCard, WeaponTypeIcon } from '../weapon-card';

interface WeaponsGridProps {
    weapons: Weapon[];
    groupByType: boolean;
    onSelect: (w: Weapon) => void;
}

export function WeaponsGrid({ weapons, groupByType, onSelect }: WeaponsGridProps) {
    if (!groupByType) {
        return (
            <GridLayout>
                {weapons.map(w => (
                    <WeaponCard key={w.id} weapon={w} onClick={onSelect} />
                ))}
            </GridLayout>
        );
    }

    // Build ordered groups preserving data order (already sorted by type+id)
    const groups: { label: string; kind: string; items: Weapon[] }[] = [];
    let currentGroup: { label: string; kind: string; items: Weapon[] } | null = null;
    weapons.forEach(w => {
        const label = WEAPON_KIND_LABELS[w.kind] || w.kind;
        if (!currentGroup || currentGroup.label !== label) {
            currentGroup = { label, kind: w.kind, items: [] };
            groups.push(currentGroup);
        }
        currentGroup.items.push(w);
    });

    return (
        <GridLayout>
            {groups.map(group => (
                <div key={group.label} className="contents">
                    <GroupHeader label={group.label} count={group.items.length} iconNode={<WeaponTypeIcon kind={group.kind} size={18} />} />
                    {group.items.map((w, i) => {
                        const prevWeapon = group.items[i - 1];
                        const currentSeries = w.series?.name || 'Independent';
                        const prevSeries = prevWeapon?.series?.name || 'Independent';
                        const showSeriesDivider = i === 0 || currentSeries !== prevSeries;

                        return (
                            <Fragment key={w.id}>
                                {showSeriesDivider && (
                                    <div className="col-span-full flex items-center gap-3 pt-6 pb-2 first-of-type:pt-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{currentSeries}</h4>
                                        <div className="flex-1 h-px bg-white/[0.06]" />
                                    </div>
                                )}
                                <WeaponCard weapon={w} onClick={onSelect} />
                            </Fragment>
                        );
                    })}
                </div>
            ))}
        </GridLayout>
    );
}
