import { useState, useEffect, useCallback, memo } from "react";
import { Copy, Check, ChevronDown, Loader2, Code2 } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Tabs are no longer needed here as we only show the solution
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

interface SolutionCodeBlockProps {
    problemId: number;
    defaultLanguage?: string;
}

interface CodeSnippet {
    id: number;
    problemId: number;
    language: string;
    code: string;
    type: string;
    createdAt: string;
}

export const SolutionCodeBlock = memo(function SolutionCodeBlock({
    problemId,
    defaultLanguage = 'cpp'
}: SolutionCodeBlockProps) {
    const [selectedLang, setSelectedLang] = useState(defaultLanguage);
    const [activeTab, setActiveTab] = useState<'input-output' | 'solution'>('input-output');
    const [inputOutputCode, setInputOutputCode] = useState<string>('');
    const [solutionCode, setSolutionCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    // Fetch code for the selected language
    useEffect(() => {
        const fetchCode = async () => {
            setIsLoading(true);
            setError(null);
            setSolutionCode('');
            try {
                const solutionResponse = await fetch(`/api/problems/${problemId}/code/${selectedLang}?type=solution`);

                if (solutionResponse.ok) {
                    const solutionSnippet: CodeSnippet = await solutionResponse.json();
                    setSolutionCode(solutionSnippet.code);
                } else {
                    setError(`No ${AVAILABLE_LANGUAGES.find(l => l.id === selectedLang)?.label || selectedLang} code available yet.`);
                }
            } catch (err) {
                setError('Failed to load code snippets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCode();
    }, [problemId, selectedLang]);

    const handleCopy = useCallback(async () => {
        if (solutionCode) {
            await navigator.clipboard.writeText(solutionCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [solutionCode]);

    const handleLangSelect = useCallback((langId: string) => {
        setSelectedLang(langId);
        setShowLangMenu(false);
    }, []);

    return (
        <div className="relative my-4 overflow-hidden rounded-lg border border-border bg-[#1e1e1e] shadow-sm group">
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d] bg-[#2d2d2d]/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-[#3d3d3d] rounded">
                        <Code2 className="h-3.5 w-3.5" />
                        Solution
                    </div>
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
                    disabled={!solutionCode}
                    className="p-1.5 hover:bg-[#3d3d3d] rounded transition-colors disabled:opacity-50"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                        <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-white" />
                    )}
                </button>
            </div>

            <div className="min-h-[200px]">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground text-sm">Loading solution code...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                        {error}
                    </div>
                ) : solutionCode ? (
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
                        {solutionCode}
                    </SyntaxHighlighter>
                ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                        No solution code available for {AVAILABLE_LANGUAGES.find(l => l.id === selectedLang)?.label || selectedLang}.
                    </div>
                )}
            </div>
        </div>
    );
});
