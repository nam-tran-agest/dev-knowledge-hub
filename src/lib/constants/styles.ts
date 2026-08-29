/**
 * Unified Cyberpunk FUI Design System Constants
 * Style: Chamfered Polygons / Corner Brackets / Monospace Telemetry / Neon Cyan (#00f0ff) & Neon Magenta (#ff007f)
 */

export const TYPOGRAPHY = {
    // Fonts
    fontSans: 'font-mono',
    fontMono: 'font-mono',

    // Titles
    heroTitle: 'font-mono text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-wider leading-[1.1] text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]',
    sectionTitle: 'font-mono text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white leading-tight',
    cardTitle: 'font-mono text-lg sm:text-xl font-bold uppercase tracking-wider text-white',

    // Body & Labels
    bodyMain: 'font-mono text-xs sm:text-sm text-slate-300 leading-relaxed font-normal uppercase',
    bodySub: 'font-mono text-[11px] sm:text-xs text-primary/60 leading-relaxed uppercase',
    label: 'font-mono text-[10px] font-bold uppercase tracking-widest text-primary/70',

    // Special Utilities
    textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary-foreground',
    textGradientCyan: 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400',
    textGradientPink: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400',
} as const;

export const COLORS = {
    background: 'bg-[#04060f]',
    surface: 'bg-[#050714]/80',
    surfaceHover: 'bg-[#060a1e]/90',
    foreground: 'text-white',
    primary: 'text-primary',
    primaryBg: 'bg-primary',
    secondary: 'text-primary/70',
    muted: 'text-primary/50',
    accent: 'text-primary',
    border: 'border-primary/30',
    borderGlow: 'border-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]',
} as const;

export const EFFECTS = {
    glass: 'bg-[#050714]/80 backdrop-blur-xl border border-primary/30 cyber-clip shadow-2xl hover:border-primary transition-all duration-300',
    glassCard: 'bg-[#050714]/80 backdrop-blur-2xl border border-primary/30 cyber-clip hover:border-primary hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all duration-300',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.35)]',
    subtleGlow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]',
} as const;

export const LAYOUT = {
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    flexRowCenter: 'flex items-center justify-center',
    flexColCenter: 'flex flex-col items-center justify-center',
    flexBetween: 'flex items-center justify-between',
} as const;

export const RADIUS = {
    sm: 'cyber-clip-sm',
    md: 'cyber-clip-button',
    lg: 'cyber-clip',
    xl: 'cyber-clip-lg',
    full: 'cyber-clip-button',
} as const;

export const ANIMATIONS = {
    transition: 'transition-all duration-300 ease-out',
    fadeIn: 'animate-in fade-in duration-300',
    slideUp: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
} as const;
