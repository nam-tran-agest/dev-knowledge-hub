import type { Weapon } from '../../types';
import { WEAPON_KIND_LABELS } from '../../constants/shared';
import { GroupHeader } from '../ui/group-header';
import { WeaponCard, WeaponTypeIcon } from '../weapon-card';
import { GridLayout } from '../ui/grid-layout';

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

    // Build ordered groups preserving data order (already sorted by type+rarity)
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
                    {group.items.map(w => (
                        <WeaponCard key={w.id} weapon={w} onClick={onSelect} />
                    ))}
                </div>
            ))}
        </GridLayout>
    );
}
