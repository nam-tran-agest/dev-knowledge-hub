'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

export const PROJECT_THEME_COLORS = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Violet
]

interface ProjectColorPickerProps {
    selectedColor: string
    onColorSelect: (color: string) => void
    label?: string
}

export function ProjectColorPicker({
    selectedColor,
    onColorSelect,
    label = 'Theme Color'
}: ProjectColorPickerProps) {
    return (
        <div className="space-y-3">
            <Label className="text-slate-200 text-xs font-mono uppercase tracking-wider">{label}</Label>
            <div className="flex flex-wrap gap-3">
                {PROJECT_THEME_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onColorSelect(color)}
                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 cursor-pointer ${
                            selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#070d1e] scale-110 shadow-lg' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    )
}
