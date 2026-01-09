'use client'

import { useState, useCallback } from 'react'

interface UseCopyToClipboardResult {
    copied: boolean
    copy: (text: string) => Promise<boolean>
}

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardResult {
    const [copied, setCopied] = useState(false)

    const copy = useCallback(
        async (text: string): Promise<boolean> => {
            if (!navigator?.clipboard) {
                console.warn('Clipboard not supported')
                return false
            }

            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)

                setTimeout(() => {
                    setCopied(false)
                }, resetDelay)

                return true
            } catch (error) {
                console.warn('Copy failed', error)
                setCopied(false)
                return false
            }
        },
        [resetDelay]
    )

    return { copied, copy }
}
