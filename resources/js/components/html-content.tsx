import { useMemo } from 'react';

interface HtmlContentProps {
    content: string | null | undefined;
    className?: string;
    fallback?: string;
}

export function HtmlContent({
    content,
    className = '',
    fallback = 'No description provided.',
}: HtmlContentProps) {
    const htmlContent = useMemo(() => {
        if (!content || content.trim() === '') {
            return fallback;
        }
        return content;
    }, [content, fallback]);

    if (!content || content.trim() === '' || content === '<p></p>') {
        return <div className={className}>{fallback}</div>;
    }

    return (
        <div
            className={`${className} prose prose-sm max-w-none`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}

