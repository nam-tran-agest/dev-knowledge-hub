'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'motion/react'

interface InlineTaskCreatorProps {
    onSuggest: (title: string) => void
    projectId?: string
}

export function InlineTaskCreator({ onSuggest }: InlineTaskCreatorProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [title, setTitle] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            onSuggest(title.trim())
            setTitle('')
            setIsFocused(false)
        }
    }

    return (
        <div className="relative">
            <form
                onSubmit={handleSubmit}
                className={isFocused ? "bg-[#16161a] rounded-xl border border-[#6366f1]/30 p-1" : ""}
            >
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-500">
                        <Plus size={18} />
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !title && setIsFocused(false)}
                        placeholder="Quickly add a task..."
                        className="pl-10 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-slate-500 h-10"
                    />
                </div>

                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-3 flex justify-end gap-2"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFocused(false)
                                    setTitle('')
                                }}
                                className="text-xs text-slate-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="text-xs font-bold text-[#6366f1] hover:text-[#4f46e5] transition-colors disabled:opacity-50"
                            >
                                Press Enter to Save
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    )
}
