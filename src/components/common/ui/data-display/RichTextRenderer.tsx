import { cn } from '@/lib/utils';

interface RichTextRendererProps {
    content: string;
    className?: string;
}

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
    return (
        <div className={cn("prose prose-invert max-w-none", className)}>
            <p>{content}</p>
        </div>
    );
}
