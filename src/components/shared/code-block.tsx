'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButton } from '@/components/snippets/copy-button'

interface CodeBlockProps {
    code: string
    language?: string
    showLineNumbers?: boolean
    showCopyButton?: boolean
}

export function CodeBlock({
    code,
    language = 'text',
    showLineNumbers = false,
    showCopyButton = true
}: CodeBlockProps) {
    return (
        <div className="relative group">
            {showCopyButton && (
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <CopyButton text={code} />
                </div>
            )}
            <div className="absolute left-3 top-2 text-xs text-zinc-400 uppercase font-mono">
                {language}
            </div>
            <SyntaxHighlighter
                style={oneDark}
                language={language}
                showLineNumbers={showLineNumbers}
                PreTag="div"
                className="rounded-lg !pt-8 !bg-zinc-900"
                customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}
