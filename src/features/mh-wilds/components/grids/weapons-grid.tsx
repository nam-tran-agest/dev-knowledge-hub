import type { Weapon } from '../../types';
import { WEAPON_KIND_LABELS } from '../../constants/shared';
import { GroupHeader } from '../ui/group-header';
import { WeaponCard, WeaponTypeIcon } from '../weapon-card';

interface WeaponsGridProps {
    weapons: Weapon[];
    groupByType: boolean;
    onSelect: (w: Weapon) => void;
}

export function WeaponsGrid({ weapons, groupByType, onSelect }: WeaponsGridProps) {
    if (!groupByType) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {weapons.map(w => (
                    <WeaponCard key={w.id} weapon={w} onClick={onSelect} />
                ))}
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {groups.map(group => (
                <div key={group.label} className="contents">
                    <GroupHeader label={group.label} count={group.items.length} iconNode={<WeaponTypeIcon kind={group.kind} size={18} />} />
                    {group.items.map(w => (
                        <WeaponCard key={w.id} weapon={w} onClick={onSelect} />
                    ))}
                </div>
            ))}
        </div>
    );
}
