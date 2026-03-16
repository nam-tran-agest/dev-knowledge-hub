import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import dynamic from 'next/dynamic';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

const SyntaxHighlighter = dynamic(
    () => import('react-syntax-highlighter').then(mod => {
        const { PrismLight } = mod;
        return Promise.all([
            import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
            import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
            import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
            import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
            import('react-syntax-highlighter/dist/esm/languages/prism/css'),
            import('react-syntax-highlighter/dist/esm/languages/prism/json'),
            import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
            import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
        ]).then(([ts, tsx, js, jsx, css, json, bash, markdown]) => {
            PrismLight.registerLanguage('typescript', ts.default);
            PrismLight.registerLanguage('ts', ts.default);
            PrismLight.registerLanguage('tsx', tsx.default);
            PrismLight.registerLanguage('javascript', js.default);
            PrismLight.registerLanguage('js', js.default);
            PrismLight.registerLanguage('jsx', jsx.default);
            PrismLight.registerLanguage('css', css.default);
            PrismLight.registerLanguage('json', json.default);
            PrismLight.registerLanguage('bash', bash.default);
            PrismLight.registerLanguage('markdown', markdown.default);
            return PrismLight;
        });
    }),
    { ssr: false, loading: () => <pre className="rounded-xl !bg-slate-900 !p-6 !my-6 animate-pulse h-48" /> }
);

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
                        
                        // Handle code blocks (not inline) even if no language is detected
                        if (!inline) {
                            return (
                                <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match ? match[1] : 'text'}
                                    PreTag="div"
                                    className="rounded-xl !bg-slate-900 !p-6 !my-6 shadow-sm border border-white/5"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        }

                        // Inline code fallback
                        return (
                            <code {...props} className={cn("bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-sm !bg-transparent", accentClass, className)}>
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
