'use client'

import React from 'react'
import { IssueType, TaskPriority } from '../types/working'
import { 
    Zap, 
    CheckSquare, 
    Bug, 
    Layers, 
    ChevronUp, 
    Equal, 
    ChevronDown, 
    ChevronsDown,
    Flame,
    type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IssueTypeConfig {
    label: string;
    icon: LucideIcon;
    bg: string;
    border: string;
    text: string;
    glow: string;
    iconBg: string;
}

const ISSUE_TYPE_CONFIG: Record<IssueType, IssueTypeConfig> = {
    story: {
        label: 'STORY',
        icon: Zap,
        bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
        iconBg: 'bg-emerald-500/20 text-emerald-300'
    },
    task: {
        label: 'TASK',
        icon: CheckSquare,
        bg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
        border: 'border-cyan-500/40',
        text: 'text-cyan-400',
        glow: 'shadow-[0_0_12px_rgba(6,182,212,0.35)]',
        iconBg: 'bg-cyan-500/20 text-cyan-300'
    },
    bug: {
        label: 'BUG',
        icon: Bug,
        bg: 'bg-rose-500/10 hover:bg-rose-500/20',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.45)]',
        iconBg: 'bg-rose-500/25 text-rose-300'
    },
    epic: {
        label: 'EPIC',
        icon: Layers,
        bg: 'bg-purple-500/10 hover:bg-purple-500/20',
        border: 'border-purple-500/50',
        text: 'text-purple-300',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
        iconBg: 'bg-purple-500/25 text-purple-200'
    }
}

/**
 * Super Sleek Issue Type Badge & Icon
 */
export function IssueTypeBadge({ 
    type = 'task', 
    showLabel = true,
    size = 'md'
}: { 
    type?: IssueType; 
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}) {
    const config = ISSUE_TYPE_CONFIG[type] || ISSUE_TYPE_CONFIG.task

    const Icon = config.icon

    const iconSizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'
    const containerClass = size === 'sm' 
        ? 'text-[9px] px-1.5 py-0.5 gap-1' 
        : size === 'lg'
        ? 'text-xs px-2.5 py-1 gap-1.5'
        : 'text-[10px] px-2 py-0.5 gap-1.5'

    return (
        <span 
            className={cn(
                "inline-flex items-center font-mono font-bold uppercase tracking-wider cyber-clip-tag border transition-all duration-300 select-none",
                config.bg,
                config.border,
                config.text,
                config.glow,
                containerClass
            )}
            title={`Issue Type: ${config.label}`}
        >
            <span className={cn("p-0.5 rounded-sm flex items-center justify-center", config.iconBg)}>
                <Icon className={iconSizeClass} />
            </span>
            {showLabel && <span>{config.label}</span>}
        </span>
    )
}

interface PriorityConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    glow: string;
    bg: string;
}

const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
    highest: {
        label: 'HIGHEST',
        icon: Flame,
        color: 'text-rose-500',
        glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse',
        bg: 'bg-rose-500/10 border-rose-500/30'
    },
    high: {
        label: 'HIGH',
        icon: ChevronUp,
        color: 'text-amber-400',
        glow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]',
        bg: 'bg-amber-500/10 border-amber-500/30'
    },
    medium: {
        label: 'MEDIUM',
        icon: Equal,
        color: 'text-yellow-300',
        glow: 'drop-shadow-[0_0_4px_rgba(253,224,71,0.4)]',
        bg: 'bg-yellow-500/10 border-yellow-500/20'
    },
    low: {
        label: 'LOW',
        icon: ChevronDown,
        color: 'text-teal-400',
        glow: 'drop-shadow-[0_0_4px_rgba(45,212,191,0.4)]',
        bg: 'bg-teal-500/10 border-teal-500/20'
    },
    lowest: {
        label: 'LOWEST',
        icon: ChevronsDown,
        color: 'text-slate-400',
        glow: '',
        bg: 'bg-slate-500/10 border-slate-500/20'
    }
}

/**
 * Super Sleek Priority Icon & Tooltip
 */
export function PriorityBadge({ 
    priority = 'medium',
    showLabel = false
}: { 
    priority?: TaskPriority;
    showLabel?: boolean;
}) {
    const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium

    const Icon = config.icon

    return (
        <span 
            className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 cyber-clip-tag border transition-all select-none",
                config.bg,
                config.color
            )}
            title={`Priority: ${config.label}`}
        >
            <Icon className={cn("w-3.5 h-3.5 shrink-0", config.color, config.glow)} />
            {showLabel && <span className="font-bold tracking-wider">{config.label}</span>}
        </span>
    )
}

/**
 * Super Sleek Story Points Hex/Pill Badge
 */
export function StoryPointsBadge({ 
    points 
}: { 
    points?: number | null 
}) {
    if (points === undefined || points === null) return null

    return (
        <span 
            className="inline-flex items-center gap-1 font-mono text-[10px] font-extrabold px-2 py-0.5 bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 transition-all cyber-clip-tag shadow-[0_0_10px_rgba(0,240,255,0.25)] select-none"
            title={`${points} Story Points (Agile Estimation)`}
        >
            <span className="text-primary/60 text-[9px]">◈</span>
            <span>{points}</span>
            <span className="text-[8px] text-primary/50 tracking-tighter">SP</span>
        </span>
    )
}

/**
 * Sleek Subtasks Progress Bar Indicator
 */
export function SubtasksProgressIndicator({ 
    completed, 
    total 
}: { 
    completed: number; 
    total: number 
}) {
    if (total === 0) return null

    const percent = Math.round((completed / total) * 100)
    const isAllDone = completed === total

    return (
        <div 
            className="flex items-center gap-1.5 text-[9px] font-mono select-none"
            title={`Subtasks: ${completed}/${total} completed (${percent}%)`}
        >
            <div className="w-12 h-1.5 bg-surface-deep border border-primary/20 rounded-none overflow-hidden relative">
                <div 
                    className={cn(
                        "h-full transition-all duration-500",
                        isAllDone 
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" 
                            : "bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_6px_var(--color-primary)]"
                    )}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <span className={cn(
                "tracking-tight",
                isAllDone ? "text-emerald-400 font-bold" : "text-primary/70"
            )}>
                {completed}/{total}
            </span>
        </div>
    )
}

/**
 * Super Sleek Issue Key / Ticket Code Badge (e.g. DEV-42)
 */
export function IssueKeyBadge({ 
    issueKey 
}: { 
    issueKey: string 
}) {
    return (
        <span className="text-[10px] font-mono font-bold text-primary/70 hover:text-primary transition-colors tracking-wider border-b border-dashed border-primary/30 select-none">
            {issueKey}
        </span>
    )
}
