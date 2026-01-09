'use client'

import { useEffect, useCallback } from 'react'

interface ShortcutOptions {
    metaKey?: boolean
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    preventDefault?: boolean
}

export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: ShortcutOptions = {}
) {
    const {
        metaKey = false,
        ctrlKey = false,
        shiftKey = false,
        altKey = false,
        preventDefault = true,
    } = options

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Check if we're in an input field
            const target = event.target as HTMLElement
            const isInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable

            // Allow meta/ctrl shortcuts even in inputs
            const hasModifier = event.metaKey || event.ctrlKey

            if (isInput && !hasModifier) return

            // Check if the key matches
            const keyMatches = event.key.toLowerCase() === key.toLowerCase()

            // Check modifiers (support both Cmd and Ctrl for cross-platform)
            const metaMatches = metaKey ? (event.metaKey || event.ctrlKey) : true
            const ctrlMatches = ctrlKey ? event.ctrlKey : true
            const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey
            const altMatches = altKey ? event.altKey : !event.altKey

            if (keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches) {
                if (preventDefault) {
                    event.preventDefault()
                }
                callback()
            }
        },
        [key, metaKey, ctrlKey, shiftKey, altKey, preventDefault, callback]
    )

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}
