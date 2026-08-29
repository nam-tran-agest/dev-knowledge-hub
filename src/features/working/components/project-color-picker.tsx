'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

export const PROJECT_THEME_COLORS = [
    '#00f0ff', // Cyber Cyan
    '#ff007f', // Neon Magenta
    '#ffb703', // Neon Amber
    '#00f59b', // Neon Green
    '#7928ca', // Cyber Purple
    '#3b82f6', // Electric Blue
    '#ff003c', // Cyber Red
]

interface ProjectColorPickerProps {
    selectedColor: string
    onColorSelect: (color: string) => void
    label?: string
}

export function ProjectColorPicker({
    selectedColor,
    onColorSelect,
    label = 'Neon Theme Accent'
}: ProjectColorPickerProps) {
    return (
        <div className="space-y-2 font-mono">
            <Label className="text-primary/80 text-xs uppercase tracking-wider">{label}</Label>
            <div className="flex flex-wrap gap-2.5 pt-1">
                {PROJECT_THEME_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onColorSelect(color)}
                        className={`w-7 h-7 cyber-clip-button transition-all hover:scale-110 cursor-pointer border ${
                            selectedColor === color ? 'border-white scale-110 shadow-[0_0_12px_var(--color-primary)]' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
        </div>
    )
}
