/**
 * Unified Cyberpunk FUI Design System Constants (Single Source of Truth)
 * Centralizes Typography, Theme Color Tokens, Module Palettes, and Component Presets.
 */

import { CyberActionColor } from '@/components/ui/cyber/tactical-action-button';

export const TYPOGRAPHY = {
    // Fonts
    fontSans: 'font-sans',
    fontMono: 'font-mono',

    // Headings
    heroTitle: 'font-mono text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]',
    sectionTitle: 'font-mono text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white leading-tight',
    cardTitle: 'font-mono text-xl sm:text-2xl font-bold uppercase tracking-widest text-white',
    subTitle: 'font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary/80',

    // Body & Labels
    bodyMain: 'font-mono text-xs sm:text-sm text-slate-300 leading-relaxed font-normal',
    bodySub: 'font-mono text-[11px] sm:text-xs text-primary/60 leading-relaxed uppercase',
    label: 'font-mono text-[10px] font-bold uppercase tracking-widest text-primary/70',
    telemetry: 'font-mono text-[9px] uppercase tracking-wider text-primary/80',

    // Gradients
    textGradientCyan: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-cyan-400',
    textGradientIndigo: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-400 to-cyan-300',
    textGradientEmerald: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-cyan-300',
    textGradientAmber: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-400 to-yellow-300',
    textGradientCrimson: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-red-400 to-amber-400',
} as const;

export const COLORS = {
    background: 'bg-background',
    surface: 'bg-surface/90',
    surfaceHover: 'bg-surface-elevated/95',
    foreground: 'text-white',
    primary: 'text-primary',
    primaryBg: 'bg-primary',
    secondary: 'text-primary/70',
    muted: 'text-primary/50',
    border: 'border-primary/30',
    borderGlow: 'border-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]',
} as const;

export interface ModuleThemeConfig {
    id: string;
    name: string;
    code: string;
    color: CyberActionColor;
    cardBorder: string;
    cardHoverBorder: string;
    cardHoverShadow: string;
    iconBg: string;
    iconBorder: string;
    iconColor: string;
    iconShadow: string;
    tagBg: string;
    tagBorder: string;
    tagText: string;
    bracketsClass: string;
    blurBlob: string;
    actionLabel: string;
}

export const MODULE_THEMES: Record<'planner' | 'working' | 'media' | 'mhWilds', ModuleThemeConfig> = {
    planner: {
        id: 'planner',
        name: 'Daily Planner',
        code: 'MODULE_01',
        color: 'cyan',
        cardBorder: 'border-cyan-500/30',
        cardHoverBorder: 'hover:border-cyan-400',
        cardHoverShadow: 'hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]',
        iconBg: 'bg-cyan-500/15',
        iconBorder: 'border-cyan-400/50',
        iconColor: 'text-cyan-300',
        iconShadow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
        tagBg: 'bg-cyan-500/15',
        tagBorder: 'border-cyan-400/50',
        tagText: 'text-cyan-300',
        bracketsClass: 'cyber-brackets',
        blurBlob: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
        actionLabel: 'LAUNCH MODULE',
    },
    working: {
        id: 'working',
        name: 'Working Hub',
        code: 'MODULE_02',
        color: 'indigo',
        cardBorder: 'border-indigo-500/30',
        cardHoverBorder: 'hover:border-indigo-400',
        cardHoverShadow: 'hover:shadow-[0_0_35px_rgba(99,102,241,0.4)]',
        iconBg: 'bg-indigo-500/15',
        iconBorder: 'border-indigo-400/50',
        iconColor: 'text-indigo-300',
        iconShadow: 'shadow-[0_0_15px_rgba(99,102,241,0.25)]',
        tagBg: 'bg-indigo-500/15',
        tagBorder: 'border-indigo-400/50',
        tagText: 'text-indigo-300',
        bracketsClass: 'cyber-brackets-indigo',
        blurBlob: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
        actionLabel: 'ACCESS',
    },
    media: {
        id: 'media',
        name: 'Media Center',
        code: 'MODULE_03',
        color: 'cyan',
        cardBorder: 'border-cyan-500/30',
        cardHoverBorder: 'hover:border-cyan-400',
        cardHoverShadow: 'hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]',
        iconBg: 'bg-cyan-500/15',
        iconBorder: 'border-cyan-400/50',
        iconColor: 'text-cyan-300',
        iconShadow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
        tagBg: 'bg-cyan-500/15',
        tagBorder: 'border-cyan-400/50',
        tagText: 'text-cyan-300',
        bracketsClass: 'cyber-brackets',
        blurBlob: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
        actionLabel: 'BROWSE',
    },
    mhWilds: {
        id: 'mh-wilds',
        name: 'MH Wilds Vault',
        code: 'MODULE_04',
        color: 'crimson',
        cardBorder: 'border-destructive/30',
        cardHoverBorder: 'hover:border-destructive',
        cardHoverShadow: 'hover:shadow-[0_0_40px_rgba(255,0,60,0.4)]',
        iconBg: 'bg-red-500/15',
        iconBorder: 'border-red-400/50',
        iconColor: 'text-red-300',
        iconShadow: 'shadow-[0_0_15px_rgba(255,0,60,0.25)]',
        tagBg: 'bg-red-500/15',
        tagBorder: 'border-red-400/50',
        tagText: 'text-red-300',
        bracketsClass: 'cyber-brackets-red',
        blurBlob: 'bg-destructive/10 group-hover:bg-destructive/20',
        actionLabel: 'OPEN VAULT',
    },
} as const;

export const EFFECTS = {
    glass: 'bg-surface/80 backdrop-blur-xl border border-primary/30 cyber-clip shadow-2xl hover:border-primary transition-all duration-300',
    glassCard: 'cyber-clip glass-panel border border-primary/30 hover:border-primary transition-all duration-300',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.35)]',
    subtleGlow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]',
} as const;

export const LAYOUT = {
    container: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    flexRowCenter: 'flex items-center justify-center',
    flexColCenter: 'flex flex-col items-center justify-center',
    flexBetween: 'flex items-center justify-between',
} as const;
