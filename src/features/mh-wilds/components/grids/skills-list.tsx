import type { Skill } from '../../types';
import { GridLayout } from '../ui/shared';
import { SkillCard } from '../skill-card';

interface SkillsGridProps {
    skills: Skill[];
    onSelect: (s: Skill) => void;
}

export function SkillsGrid({ skills, onSelect }: SkillsGridProps) {
    return (
        <GridLayout>
            {skills.map(skill => (
                <SkillCard key={skill.id} skill={skill} onClick={onSelect} />
            ))}
        </GridLayout>
    );
}
