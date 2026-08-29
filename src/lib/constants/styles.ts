/**
 * Unified Modern Design System Constants
 * Style: Titanium Neo-Dark / Clean Glassmorphism / Electric Accents
 */

export const TYPOGRAPHY = {
    // Fonts
    fontSans: 'font-sans',
    fontMono: 'font-mono',

    // Titles
    heroTitle: 'font-sans text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400',
    sectionTitle: 'font-sans text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight',
    cardTitle: 'font-sans text-xl sm:text-2xl font-bold text-white tracking-tight',

    // Body & Labels
    bodyMain: 'font-sans text-base sm:text-lg text-slate-300 leading-relaxed font-normal',
    bodySub: 'font-sans text-sm sm:text-base text-slate-400 leading-relaxed',
    label: 'font-sans text-xs font-semibold uppercase tracking-wider text-slate-400',

    // Special Utilities
    textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400',
    textGradientCyan: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400',
    textGradientAmber: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500',
} as const;

export const COLORS = {
    background: 'bg-[#07090e]',
    surface: 'bg-[#0e131f]/70',
    surfaceHover: 'bg-[#151c2d]/80',
    foreground: 'text-white',
    primary: 'text-indigo-400',
    primaryBg: 'bg-indigo-600',
    secondary: 'text-slate-400',
    muted: 'text-slate-500',
    accent: 'text-cyan-400',
    border: 'border-white/10',
    borderGlow: 'border-indigo-500/30',
} as const;

export const EFFECTS = {
    glass: 'bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl hover:border-white/20 transition-all duration-300',
    glassCard: 'bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-2xl border border-white/10 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] transition-all duration-300',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]',
    subtleGlow: 'shadow-[0_0_15px_rgba(255,255,255,0.05)]',
} as const;

export const LAYOUT = {
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    flexRowCenter: 'flex items-center justify-center',
    flexColCenter: 'flex flex-col items-center justify-center',
    flexBetween: 'flex items-center justify-between',
} as const;

export const RADIUS = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
} as const;

export const ANIMATIONS = {
    transition: 'transition-all duration-300 ease-out',
    fadeIn: 'animate-in fade-in duration-500',
    slideUp: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
} as const;
