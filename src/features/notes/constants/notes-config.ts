export interface CategoryConfig {
    table: string;
    label: string;
    bg: string;
    gradient: string;
    headingGradient: string;
    accentClass: string;
    accentBorder: string;
    activeClass: string;
    iconBg: string;
}

export const NOTES_CONFIG: Record<string, CategoryConfig> = {
    work: {
        table: 'kb_notes_work',
        label: 'Work',
        bg: 'bg-blue-500/5',
        gradient: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e0f2fe]',
        headingGradient: 'from-blue-600 to-indigo-600',
        accentClass: 'text-blue-600',
        accentBorder: 'border-blue-500/30',
        activeClass: 'bg-blue-600 text-white',
        iconBg: 'bg-blue-100/50',
    },
    learn: {
        table: 'kb_notes_learn',
        label: 'Learn',
        bg: 'bg-emerald-500/5',
        gradient: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#dcfce7]',
        headingGradient: 'from-emerald-600 to-teal-600',
        accentClass: 'text-emerald-600',
        accentBorder: 'border-emerald-500/30',
        activeClass: 'bg-emerald-600 text-white',
        iconBg: 'bg-emerald-100/50',
    },
    ideas: {
        table: 'kb_notes_ideas',
        label: 'Ideas',
        bg: 'bg-amber-500/5',
        gradient: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#fef3c7]',
        headingGradient: 'from-amber-600 to-orange-600',
        accentClass: 'text-amber-600',
        accentBorder: 'border-amber-500/30',
        activeClass: 'bg-amber-600 text-white',
        iconBg: 'bg-amber-100/50',
    },
    life: {
        table: 'kb_notes_life',
        label: 'Life',
        bg: 'bg-rose-500/5',
        gradient: 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#ffe4e6]',
        headingGradient: 'from-rose-600 to-pink-600',
        accentClass: 'text-rose-600',
        accentBorder: 'border-rose-500/30',
        activeClass: 'bg-rose-600 text-white',
        iconBg: 'bg-rose-100/50',
    },
}
