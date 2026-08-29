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
        bg: 'bg-indigo-500/5',
        gradient: 'bg-[#07090e]',
        headingGradient: 'from-indigo-400 to-blue-400',
        accentClass: 'text-indigo-400',
        accentBorder: 'border-indigo-500/30',
        activeClass: 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]',
        iconBg: 'bg-indigo-500/10 border border-indigo-500/20',
    },
    learn: {
        table: 'kb_notes_learn',
        label: 'Learn',
        bg: 'bg-emerald-500/5',
        gradient: 'bg-[#07090e]',
        headingGradient: 'from-emerald-400 to-teal-400',
        accentClass: 'text-emerald-400',
        accentBorder: 'border-emerald-500/30',
        activeClass: 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        iconBg: 'bg-emerald-500/10 border border-emerald-500/20',
    },
    ideas: {
        table: 'kb_notes_ideas',
        label: 'Ideas',
        bg: 'bg-amber-500/5',
        gradient: 'bg-[#07090e]',
        headingGradient: 'from-amber-400 to-orange-400',
        accentClass: 'text-amber-400',
        accentBorder: 'border-amber-500/30',
        activeClass: 'bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        iconBg: 'bg-amber-500/10 border border-amber-500/20',
    },
    life: {
        table: 'kb_notes_life',
        label: 'Life',
        bg: 'bg-rose-500/5',
        gradient: 'bg-[#07090e]',
        headingGradient: 'from-rose-400 to-pink-400',
        accentClass: 'text-rose-400',
        accentBorder: 'border-rose-500/30',
        activeClass: 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        iconBg: 'bg-rose-500/10 border border-rose-500/20',
    },
}
