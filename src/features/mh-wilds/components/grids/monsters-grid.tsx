import type { Monster } from '../../types';
import { SPECIES_LABELS } from '../../constants/shared';
import { GroupHeader } from '../ui/group-header';
import { MonsterCard } from '../monster-card';
import { GridLayout } from '../ui/grid-layout';

interface MonstersGridProps {
    monsters: Monster[];
    onSelect: (m: Monster) => void;
    groupBySpecies: boolean;
}

export function MonstersGrid({ monsters, onSelect, groupBySpecies }: MonstersGridProps) {
    if (!groupBySpecies) {
        return (
            <GridLayout>
                {monsters.map(m => (
                    <MonsterCard key={m.id} monster={m} onClick={onSelect} />
                ))}
            </GridLayout>
        );
    }

    // Group by species
    const groups: Record<string, Monster[]> = {};
    monsters.forEach(m => {
        const sp = SPECIES_LABELS[m.species] || m.species || 'Unknown';
        if (!groups[sp]) groups[sp] = [];
        groups[sp].push(m);
    });

    return (
        <GridLayout>
            {Object.entries(groups).map(([species, mons]) => (
                <div key={species} className="contents">
                    <GroupHeader label={species} count={mons.length} />
                    {mons.map(m => (
                        <MonsterCard key={m.id} monster={m} onClick={onSelect} />
                    ))}
                </div>
            ))}
        </GridLayout>
    );
}
