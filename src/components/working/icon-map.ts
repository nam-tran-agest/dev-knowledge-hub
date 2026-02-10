import type { LucideIcon } from 'lucide-react'
import {
    Layout,
    Code,
    Briefcase,
    Rocket,
    Lightbulb,
    BookOpen,
    Palette,
    Settings,
    Terminal,
    Globe,
    Database,
    Shield,
    Zap,
    Heart,
    Star,
    Target,
    Layers,
    Box,
    Cpu,
    Gamepad,
    Music,
    Camera,
    Pen,
    FolderOpen,
    ArrowLeft,
    Pin,
} from 'lucide-react'

/**
 * Curated map of project icons. This avoids `import * as Icons from 'lucide-react'`
 * which bundles ALL ~1500 icons into the server/worker bundle.
 *
 * Add new icons here as needed when supporting more project icon choices.
 */
export const PROJECT_ICON_MAP: Record<string, LucideIcon> = {
    Layout,
    Code,
    Briefcase,
    Rocket,
    Lightbulb,
    BookOpen,
    Palette,
    Settings,
    Terminal,
    Globe,
    Database,
    Shield,
    Zap,
    Heart,
    Star,
    Target,
    Layers,
    Box,
    Cpu,
    Gamepad,
    Music,
    Camera,
    Pen,
    FolderOpen,
}

/** Default icon when project.icon is not found in the map */
export const DEFAULT_PROJECT_ICON = Layout

/** Re-export individual icons used directly in working components */
export { ArrowLeft, Pin, Settings as SettingsIcon }
