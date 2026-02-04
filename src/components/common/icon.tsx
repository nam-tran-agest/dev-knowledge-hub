import {
    FileText,
    Code,
    CheckSquare,
    Bug,
    Lightbulb,
    Database,
    type LucideIcon
} from 'lucide-react';

export const iconsMap: Record<string, LucideIcon> = {
    'Notes': FileText,
    'Snippets': Code,
    'Tasks': CheckSquare,
    'Bugs': Bug,
    'Ideas': Lightbulb,
    'Database': Database
};
