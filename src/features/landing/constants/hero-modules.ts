import { Calendar, Layers, Newspaper, Flame, LucideIcon } from 'lucide-react';
import { ModuleThemeConfig, MODULE_THEMES } from '@/lib/constants/styles';

export interface HeroModuleItem {
    theme: ModuleThemeConfig;
    href: string;
    description: string;
    icon: LucideIcon;
    colSpan: string;
}

export const HERO_MODULES: HeroModuleItem[] = [
    {
        theme: MODULE_THEMES.planner,
        href: '/planner/today',
        description: 'Manage your tasks, track your schedule, and optimize your productivity.',
        icon: Calendar,
        colSpan: 'lg:col-span-2',
    },
    {
        theme: MODULE_THEMES.working,
        href: '/working',
        description: 'Active projects and kanban boards.',
        icon: Layers,
        colSpan: 'col-span-1',
    },
    {
        theme: MODULE_THEMES.media,
        href: '/media/youtube',
        description: 'YouTube bookmarks, Spotify integrations, and RSS News.',
        icon: Newspaper,
        colSpan: 'col-span-1',
    },
    {
        theme: MODULE_THEMES.mhWilds,
        href: '/mh-wilds',
        description: 'Comprehensive database for weapons, armors, and monster weaknesses.',
        icon: Flame,
        colSpan: 'lg:col-span-2',
    },
];
