// Adobe CC Dark Theme style classes
export const CC_STYLES = {
    // Sidebar
    sidebar: 'cc-sidebar',
    sidebarSection: 'cc-sidebar-section',
    sidebarItem: 'cc-sidebar-item',
    sidebarItemActive: 'cc-sidebar-item active',

    // Header
    header: 'cc-header',

    // Cards
    card: 'cc-card',
    hero: 'cc-hero',
    listItem: 'cc-list-item',

    // Buttons
    btnPrimary: 'cc-btn-primary',
    btnSecondary: 'cc-btn-secondary',
    btnAccent: 'cc-btn-accent',

    // Tabs
    tabs: 'cc-tabs',
    tab: 'cc-tab',
    tabActive: 'cc-tab active',

    // Inputs
    input: 'cc-input',

    // Dialog
    dialog: 'cc-dialog',

    // Icon Badge
    iconBadge: 'cc-icon-badge',

    // Status
    statusDot: 'cc-status-dot',
    statusUpdated: 'cc-status-dot updated',
    statusAvailable: 'cc-status-dot available',
} as const

// Icon badge colors (Adobe CC style)
export const ICON_COLORS = {
    notes: 'bg-gradient-to-br from-blue-500 to-blue-600',
    snippets: 'bg-gradient-to-br from-emerald-500 to-green-600',
    tasks: 'bg-gradient-to-br from-amber-500 to-orange-600',
    bugs: 'bg-gradient-to-br from-red-500 to-rose-600',
    prompt: 'bg-gradient-to-br from-purple-500 to-violet-600',
} as const

// Spacing System
export const SPACING = {
    // Vertical spacing
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    
    // Gap (for flex/grid)
    gapXs: 'gap-1',
    gapSm: 'gap-2',
    gapMd: 'gap-4',
    gapLg: 'gap-6',
    gapXl: 'gap-8',
} as const

// Padding System
export const PADDING = {
    // All sides
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
    
    // Responsive (mobile → desktop)
    responsive: 'px-2 sm:px-0',
    responsiveMd: 'p-4 md:p-6',
    
    // Horizontal
    xSm: 'px-2',
    xMd: 'px-4',
    xLg: 'px-6',
    
    // Vertical
    ySm: 'py-2',
    yMd: 'py-4',
    yLg: 'py-6',
} as const

// Radius System
export const RADIUS = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
} as const

// Common Layout Patterns
export const LAYOUT = {
    // Form containers
    form: 'w-full max-w-4xl mx-auto',
    formResponsive: 'w-full max-w-4xl mx-auto px-2 sm:px-0',
    
    // Flex patterns
    flexRow: 'flex items-center',
    flexRowBetween: 'flex items-center justify-between',
    flexRowStart: 'flex items-start',
    flexCol: 'flex flex-col',
    
    // Grid patterns
    grid2Col: 'grid grid-cols-1 md:grid-cols-2',
    grid3Col: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    
    // Container constraints
    fullWidth: 'w-full',
    maxWidth: 'max-w-full',
    minWidth: 'min-w-0',
} as const

// Size System
export const SIZES = {
    // Height
    minH300: 'min-h-[300px]',
    minH400: 'min-h-[400px]',
    minH300Responsive: 'min-h-[300px] md:min-h-[400px]',
    minH3rem: 'min-h-[3rem]',
    
    // Width
    w2: 'w-2',
    w4: 'w-4',
    h2: 'h-2',
    h4: 'h-4',
    
    // Icon sizes
    icon: 'w-4 h-4',
    iconSm: 'w-2 h-2',
    iconMd: 'w-4 h-4',
    iconLg: 'w-6 h-6',
} as const

// Border System
export const BORDERS = {
    default: 'border border-gray-800/50',
    subtle: 'border border-gray-700/50',
    top: 'border-t border-gray-800',
    bottom: 'border-b border-white/5',
    none: 'border-none',
} as const

// Background System
export const BACKGROUNDS = {
    dark: 'bg-gray-950/30',
    darker: 'bg-black/20',
    transparent: 'bg-transparent',
    subtle: 'bg-white/5',
} as const

// Animation System
export const ANIMATIONS = {
    spin: 'animate-spin',
    transition: 'transition-all',
    transitionColors: 'transition-colors',
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
} as const

// Common Component Patterns
export const PATTERNS = {
    // Tag container
    tagContainer: 'flex flex-wrap gap-2 p-4 rounded-lg bg-gray-950/30 border border-gray-800/50 min-h-[3rem]',
    
    // Editor container
    editorContainer: 'border border-gray-700/50 rounded-md overflow-hidden bg-gray-950/30 w-full',
    editorResponsive: 'border border-gray-700/50 rounded-md min-h-[300px] md:min-h-[400px] overflow-hidden bg-gray-950/30 w-full',
    
    // Loading spinner
    spinner: 'h-4 w-4 shrink-0 rounded-full border-2 border-white/30 border-t-white animate-spin',
    
    // Button group
    buttonGroup: 'flex justify-end gap-4',
    
    // Card footer
    cardFooter: 'flex justify-end gap-4 border-t border-gray-800 pt-6',
    
    // Category dot
    categoryDot: 'w-2 h-2 rounded-full',
    
    // Status dot (for task board)
    statusDot: 'w-2.5 h-2.5 rounded-full',
} as const
