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
                className={isFocused ? "bg-[#040612]/95 cyber-clip border border-primary/60 p-1 shadow-[0_0_20px_rgba(0,240,255,0.25)]" : "bg-[#040612]/60 cyber-clip border border-primary/20 p-1"}
            >
                <div className="relative flex items-center">
                    <div className="absolute left-3 text-primary/60">
                        <Plus size={15} />
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !title && setIsFocused(false)}
                        placeholder="INPUT_QUICK_TASK..."
                        className="pl-9 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-primary/40 h-9 text-xs font-mono"
                    />
                </div>

                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-3 pb-2 pt-1 flex justify-end gap-3 border-t border-primary/10 mt-1"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFocused(false)
                                    setTitle('')
                                }}
                                className="text-[10px] font-mono uppercase tracking-wider text-primary/40 hover:text-white transition-colors cursor-pointer"
                            >
                                [ CANCEL ]
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                [ COMMIT_TASK ↵ ]
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    )
}
