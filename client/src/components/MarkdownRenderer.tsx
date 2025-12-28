import ReactMarkdown, { Components } from "react-markdown";
import { Terminal, Copy, Check, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';

// Register languages
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('c', c);

// Available languages for switching
const AVAILABLE_LANGUAGES = [
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'c', label: 'C' },
    { id: 'javascript', label: 'JavaScript' },
];

// Clean code text from artifacts
const cleanCodeText = (text: string): string => {
    if (!text) return '';
    let cleaned = String(text);

    // Remove backticks
    cleaned = cleaned.replace(/`/g, '');

    // Convert escaped newlines to actual newlines
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\\t/g, '\t');
    cleaned = cleaned.replace(/\\r/g, '');

    // Remove surrounding quotes
    if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
        (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
        cleaned = cleaned.slice(1, -1);
    }

    return cleaned.trim();
};

// Separate CodeBlock component for proper React hooks usage
interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
    inline?: boolean;
    defaultLanguage?: string;
}

const CodeBlockComponent = memo(function CodeBlockComponent({ className, children, inline, defaultLanguage }: CodeBlockProps) {
    const match = /language-(\w+)/.exec(className || '');
    const rawText = String(children || '');
    const text = cleanCodeText(rawText);

    // Determine if block code
    const hasNewlines = text.includes('\n');
    const isBlock = !inline && (match || hasNewlines || text.length > 60);

    const initialLang = match ? match[1] : (defaultLanguage || 'cpp');
    const [selectedLang, setSelectedLang] = useState(initialLang);
    const [copied, setCopied] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [text]);

    useEffect(() => {
        if (defaultLanguage && !match) {
            setSelectedLang(defaultLanguage);
        }
    }, [defaultLanguage, match]);

    const handleLangSelect = useCallback((langId: string) => {
        setSelectedLang(langId);
        setShowLangMenu(false);
    }, []);

    if (isBlock) {
        return (
            <div className="relative my-4 overflow-hidden rounded-lg border border-border bg-[#1e1e1e] shadow-sm group">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d] bg-[#2d2d2d]/50">
                    <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowLangMenu(prev => !prev)}
                                className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#3d3d3d]"
                            >
                                {AVAILABLE_LANGUAGES.find(l => l.id === selectedLang)?.label || 'C++'}
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            {showLangMenu && (
                                <div className="absolute top-full left-0 mt-1 bg-[#2d2d2d] border border-[#3d3d3d] rounded-md shadow-lg z-50 min-w-[120px]">
                                    {AVAILABLE_LANGUAGES.map((lang) => (
                                        <button
                                            type="button"
                                            key={lang.id}
                                            onClick={() => handleLangSelect(lang.id)}
                                            className={`block w-full text-left px-3 py-2 text-xs hover:bg-[#3d3d3d] transition-colors ${selectedLang === lang.id ? 'text-primary bg-[#3d3d3d]' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-white" />
                        )}
                    </button>
                </div>
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={selectedLang}
                    PreTag="div"
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: '#1e1e1e',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                    }}
                    lineNumberStyle={{
                        minWidth: '2.5em',
                        paddingRight: '1em',
                        color: '#6e6e6e',
                        textAlign: 'right' as const,
                        userSelect: 'none' as const,
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: "'JetBrains Mono', monospace",
                        }
                    }}
                >
                    {text}
                </SyntaxHighlighter>
            </div>
        );
    }

    // Inline code
    return (
        <code className="bg-primary/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-primary/20">
            {text}
        </code>
    );
});

// Custom Markdown components
const MarkdownComponents: Components = {
    table: ({ children }) => (
        <div className="overflow-hidden rounded-lg border border-border my-6 shadow-sm">
            <table className="w-full text-sm text-left">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-border/50 bg-card">{children}</tbody>,
    tr: ({ children }) => <tr className="transition-colors hover:bg-muted/50">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 font-semibold text-foreground border-b border-border">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-muted-foreground align-top">{children}</td>,
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }: any) => {
        const inline = !className && !String(children).includes('\n');
        // @ts-ignore - language is passed via context or props in complex cases, but here we'll handle it via the renderer
        return <CodeBlockComponent className={className} inline={inline} defaultLanguage={(window as any).markdownLanguage}>{children}</CodeBlockComponent>;
    },
    h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-border">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-semibold text-white mb-3 mt-6">{children}</h3>,
    p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>,
    ul: ({ children }) => <ul className="text-muted-foreground mb-4 ml-4 list-disc space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="text-muted-foreground mb-4 ml-4 list-decimal space-y-2">{children}</ol>,
    li: ({ children }) => <li className="text-muted-foreground pl-1 leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary pl-4 italic my-6 text-muted-foreground bg-primary/5 py-2 pr-2 rounded-r">
            {children}
        </blockquote>
    ),
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    a: ({ children, href }) => <a href={href} className="text-primary hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer">{children}</a>,
};

// Preprocess markdown content
const preprocessMarkdown = (content: string): string => {
    if (!content) return '';

    let processed = content;

    // Convert escaped newlines to actual newlines
    processed = processed.replace(/\\n/g, '\n');
    processed = processed.replace(/\\t/g, '\t');
    processed = processed.replace(/\\r/g, '');

    return processed;
};

interface MarkdownRendererProps {
    children: string;
    language?: string;
}

export function MarkdownRenderer({ children, language }: MarkdownRendererProps) {
    if (language) {
        (window as any).markdownLanguage = language;
    }
    const processedContent = preprocessMarkdown(children);

    return (
        <div className="markdown-content prose prose-invert max-w-none">
            <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
