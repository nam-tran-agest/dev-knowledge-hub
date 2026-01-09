'use client'

import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks'

interface CopyButtonProps {
    text: string
    className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const { copied, copy } = useCopyToClipboard()

    return (
        <Button
            variant="ghost"
            size="icon"
            className={className}
            onClick={() => copy(text)}
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy code</span>
        </Button>
    )
}
