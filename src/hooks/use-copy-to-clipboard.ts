'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseCopyToClipboardResult {
    copied: boolean
    copy: (text: string) => Promise<boolean>
}

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardResult {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const copy = useCallback(
        async (text: string): Promise<boolean> => {
            if (!navigator?.clipboard) {
                console.warn('Clipboard not supported')
                return false
            }

            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)

                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }

                timeoutRef.current = setTimeout(() => {
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
