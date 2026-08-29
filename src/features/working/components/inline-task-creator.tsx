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
                className={isFocused ? "bg-[#040711]/90 rounded-2xl border border-indigo-500/40 p-1 shadow-lg glare-top" : "bg-[#040711]/40 rounded-2xl border border-white/10 p-1"}
            >
                <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500">
                        <Plus size={16} />
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !title && setIsFocused(false)}
                        placeholder="Quickly add a task..."
                        className="pl-10 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-slate-500 h-10 text-xs font-mono"
                    />
                </div>

                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-2.5 pt-1 flex justify-end gap-3"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFocused(false)
                                    setTitle('')
                                }}
                                className="text-xs font-mono text-slate-500 hover:text-white transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                Enter ↵
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    )
}
