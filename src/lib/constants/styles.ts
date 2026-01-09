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

// Animation classes
export const ANIMATIONS = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
} as const
