/**
 * Unified Design System Constants
 * Focus: Bright White / Playfair Display Serif / Teal-Blue-Indigo Gradient
 */

export const TYPOGRAPHY = {
    // Fonts
    fontSerif: 'font-serif',
    fontSans: 'font-sans',

    // Titles
    heroTitle: 'font-serif text-4xl md:text-6xl font-bold tracking-tight leading-tight text-gradient',
    sectionTitle: 'font-serif text-3xl md:text-5xl font-semibold tracking-tight text-gradient pb-2 leading-relaxed',
    cardTitle: 'font-serif text-2xl md:text-3xl font-bold text-slate-900',

    // Body & Labels
    bodyMain: 'font-sans text-lg md:text-xl text-slate-800 leading-relaxed',
    bodySub: 'font-sans text-base text-slate-600 leading-snug',
    label: 'font-sans text-sm font-medium uppercase tracking-widest text-slate-500',

    // Special Utilities
    textGradient: 'text-gradient',
} as const;

export const COLORS = {
    background: 'bg-[#f8fafc]',
    foreground: 'text-slate-900',
    primary: 'text-[#3b82f6]',
    secondary: 'text-[#4f46e5]',
    muted: 'text-slate-500',
    accent: 'text-[#2dd4bf]',
} as const;

export const EFFECTS = {
    glass: 'bg-white/10 backdrop-blur-[4px] border border-white shadow-sm hover:shadow-lg transition-all',
    shadow: 'shadow-sm hover:shadow-md transition-shadow',
} as const;

// Adobe CC Style Classes (Mapped to new Design System)
export const CC_STYLES = {
    // Layout
    header: 'bg-gray-200/30 backdrop-blur-md border-b border-slate-200/50 shadow-md',
    sidebar: 'bg-slate-50/80 backdrop-blur-lg border-r border-slate-200',
    sidebarSection: 'space-y-4 p-4',
    sidebarItem: 'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-100 text-slate-600',
    sidebarItemActive: 'bg-blue-50 text-blue-600 font-medium',

    // Components
    card: 'bg-white/60 backdrop-blur-sm border border-white rounded-2xl shadow-sm overflow-hidden',
    hero: 'relative overflow-hidden bg-slate-50',
    listItem: 'flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors',

    // Buttons
    btnPrimary: 'bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2 font-medium transition-all shadow-sm',
    btnSecondary: 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-full px-6 py-2 font-medium transition-all',
    btnAccent: 'bg-teal-500 text-white hover:bg-teal-600 rounded-full px-6 py-2 font-medium transition-all',

    // Interactive
    tabs: 'flex gap-2 p-1 bg-slate-100 rounded-full boder border-slate-200',
    tab: 'px-4 py-1.5 rounded-full text-sm font-medium text-slate-500 transition-all',
    tabActive: 'bg-white text-slate-900 shadow-sm',
    input: 'w-full bg-white border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none',
    dialog: 'bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden',

    // Status & Badges
    iconBadge: 'size-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600',
    statusDot: 'size-2.5 rounded-full bg-slate-300',
    statusUpdated: 'bg-blue-500',
    statusAvailable: 'bg-teal-500',
} as const;

export const SPACING = {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    gapXs: 'gap-1',
    gapSm: 'gap-2',
    gapMd: 'gap-4',
    gapLg: 'gap-6',
    gapXl: 'gap-8',
} as const;

export const PADDING = {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
    responsive: 'px-4 md:px-8 lg:px-16 2xl:px-0',
} as const;

export const RADIUS = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
} as const;

export const LAYOUT = {
    container: 'container mx-auto px-4 md:px-8 lg:px-16 2xl:px-0 2xl:min-w-[1440px]',
    flexRowCenter: 'flex items-center justify-center',
    flexColCenter: 'flex flex-col items-center justify-center',
} as const;

export const SIZES = {
    minH300: 'min-h-[300px]',
    minH400: 'min-h-[400px]',
    icon: 'w-4 h-4',
    iconSm: 'w-2 h-2',
    iconMd: 'w-4 h-4',
    iconLg: 'w-6 h-6',
} as const;

export const BORDERS = {
    default: 'border border-slate-200',
    subtle: 'border border-slate-100',
    none: 'border-none',
} as const;

export const BACKGROUNDS = {
    light: 'bg-slate-50',
    white: 'bg-white',
    transparent: 'bg-transparent',
    subtle: 'bg-slate-50/50',
} as const;

export const ANIMATIONS = {
    spin: 'animate-spin',
    transition: 'transition-all duration-300',
    fadeIn: 'animate-fade-in',
} as const;

export const PATTERNS = {
    spinner: 'h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin',
    buttonGroup: 'flex justify-end gap-3',
} as const;
