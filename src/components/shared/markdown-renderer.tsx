'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButton } from '@/components/snippets/copy-button'

interface MarkdownRendererProps {
    content: string
    className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    const components = useMemo(() => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const codeString = String(children).replace(/\n$/, '')

            if (!inline && match) {
                return (
                    <div className="relative group my-4">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <CopyButton text={codeString} />
                        </div>
                        <div className="absolute left-3 top-2 text-xs text-muted-foreground uppercase font-mono">
                            {language}
                        </div>
                        <SyntaxHighlighter
                            style={oneDark}
                            language={language}
                            PreTag="div"
                            className="rounded-lg !pt-8 !bg-zinc-900"
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                )
            }

            return (
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm" {...props}>
                    {children}
                </code>
            )
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h1: ({ children }: any) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b">{children}</h1>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h2: ({ children }: any) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h3: ({ children }: any) => (
            <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p: ({ children }: any) => (
            <p className="my-3 leading-7">{children}</p>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ul: ({ children }: any) => (
            <ul className="my-3 ml-6 list-disc space-y-1">{children}</ul>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ol: ({ children }: any) => (
            <ol className="my-3 ml-6 list-decimal space-y-1">{children}</ol>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        li: ({ children }: any) => (
            <li className="leading-7">{children}</li>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        blockquote: ({ children }: any) => (
            <blockquote className="my-4 pl-4 border-l-4 border-primary/50 italic text-muted-foreground">
                {children}
            </blockquote>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        a: ({ href, children }: any) => (
            <a
                href={href}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        table: ({ children }: any) => (
            <div className="my-4 overflow-x-auto">
                <table className="w-full border-collapse">{children}</table>
            </div>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        th: ({ children }: any) => (
            <th className="border px-4 py-2 text-left font-semibold bg-muted">{children}</th>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        td: ({ children }: any) => (
            <td className="border px-4 py-2">{children}</td>
        ),
        hr: () => <hr className="my-6 border-border" />,
    }), [])

    return (
        <div className={`prose prose-zinc dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    )
}
