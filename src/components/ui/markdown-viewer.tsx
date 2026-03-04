import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { cn } from '@/lib/utils';

// Register languages
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);

interface MarkdownViewerProps {
    content: string;
    className?: string;
    accentClass?: string;
    accentBorder?: string;
}

export function MarkdownViewer({ content, className = '', accentClass = 'text-primary', accentBorder = 'border-primary' }: MarkdownViewerProps) {
    return (
        <div className={cn("prose prose-lg max-w-none text-slate-900 leading-relaxed border border-transparent rounded-xl", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode;[key: string]: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl !bg-slate-900 !p-6 !my-6 shadow-sm"
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...props} className={cn("bg-slate-100 px-1.5 py-0.5 rounded font-mono text-sm", accentClass, className)}>
                                {children}
                            </code>
                        );
                    },
                    h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                    h2: ({ ...props }) => <h2 className="text-2xl font-semibold mt-10 mb-5" {...props} />,
                    h3: ({ ...props }) => <h3 className="text-xl font-medium mt-8 mb-4" {...props} />,
                    p: ({ ...props }) => <p className="mb-6 text-slate-800 leading-relaxed" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-800" {...props} />,
                    blockquote: ({ ...props }) => <blockquote className={cn("border-l-4 pl-6 italic text-lg my-8 text-slate-600", accentBorder)} {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
