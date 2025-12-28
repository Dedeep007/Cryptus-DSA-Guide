import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ProblemContext {
    problemId: number;
    problemTitle: string;
    difficulty: string;
}

interface AIContextData {
    code: string;
    problem: ProblemContext | null;
    timestamp: number;
}

// Use localStorage for reliable cross-component communication
const AI_CONTEXT_KEY = 'cryptus_ai_context';

export function setAIContext(code: string, problem?: ProblemContext) {
    const data: AIContextData = {
        code,
        problem: problem || null,
        timestamp: Date.now()
    };
    localStorage.setItem(AI_CONTEXT_KEY, JSON.stringify(data));
}

export function clearAIContext() {
    localStorage.removeItem(AI_CONTEXT_KEY);
}

function getAIContext(): AIContextData | null {
    try {
        const stored = localStorage.getItem(AI_CONTEXT_KEY);
        if (stored) {
            const data = JSON.parse(stored) as AIContextData;
            // Only use context if it's less than 30 minutes old
            if (Date.now() - data.timestamp < 30 * 60 * 1000) {
                return data;
            }
        }
    } catch (e) {
        console.error('Error reading AI context:', e);
    }
    return null;
}

// Simple markdown renderer for chat messages
function renderFormattedMessage(content: string) {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // Split by code blocks first
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    const processInlineMarkdown = (text: string): React.ReactNode[] => {
        const nodes: React.ReactNode[] = [];
        // Process inline code, bold, italic
        const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g;
        let inlineLastIndex = 0;
        let inlineMatch;

        while ((inlineMatch = inlineRegex.exec(text)) !== null) {
            // Add text before match
            if (inlineMatch.index > inlineLastIndex) {
                nodes.push(text.slice(inlineLastIndex, inlineMatch.index));
            }

            const matched = inlineMatch[0];
            if (matched.startsWith('`') && matched.endsWith('`')) {
                // Inline code
                nodes.push(
                    <code key={key++} className="bg-black/40 px-1.5 py-0.5 rounded text-primary font-mono text-xs">
                        {matched.slice(1, -1)}
                    </code>
                );
            } else if ((matched.startsWith('**') && matched.endsWith('**')) || (matched.startsWith('__') && matched.endsWith('__'))) {
                // Bold
                nodes.push(<strong key={key++} className="font-bold text-white">{matched.slice(2, -2)}</strong>);
            } else if ((matched.startsWith('*') && matched.endsWith('*')) || (matched.startsWith('_') && matched.endsWith('_'))) {
                // Italic
                nodes.push(<em key={key++} className="italic">{matched.slice(1, -1)}</em>);
            }

            inlineLastIndex = inlineMatch.index + matched.length;
        }

        // Add remaining text
        if (inlineLastIndex < text.length) {
            nodes.push(text.slice(inlineLastIndex));
        }

        return nodes.length > 0 ? nodes : [text];
    };

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // Add text before code block
        if (match.index > lastIndex) {
            const textBefore = content.slice(lastIndex, match.index);
            parts.push(
                <span key={key++}>
                    {processInlineMarkdown(textBefore)}
                </span>
            );
        }

        // Add code block
        const language = match[1] || '';
        const code = match[2].trim();
        parts.push(
            <div key={key++} className="my-2 rounded-lg overflow-hidden bg-black/60 border border-white/10">
                {language && (
                    <div className="px-3 py-1 bg-white/5 text-xs text-muted-foreground border-b border-white/10">
                        {language}
                    </div>
                )}
                <pre className="p-3 overflow-x-auto">
                    <code className="text-xs font-mono text-green-300">{code}</code>
                </pre>
            </div>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
        parts.push(
            <span key={key++}>
                {processInlineMarkdown(content.slice(lastIndex))}
            </span>
        );
    }

    return parts.length > 0 ? parts : content;
}

export function AIAssistant() {
    const { user } = useAuth();
    const [location] = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your CRYPTUS AI assistant. 👋\n\nI can help you with:\n• Understanding problems and concepts\n• Debugging your code (hints, not solutions!)\n• Navigating the platform\n\nHow can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentContext, setCurrentContext] = useState<AIContextData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Poll for context updates when chat is open
    useEffect(() => {
        const updateContext = () => {
            const ctx = getAIContext();
            setCurrentContext(ctx);
        };

        updateContext();

        if (isOpen) {
            const interval = setInterval(updateContext, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen, location]);

    // Determine current page context
    const getPageContext = () => {
        if (location.startsWith('/problem/')) {
            return 'problem';
        } else if (location.startsWith('/topic/')) {
            return 'topic';
        } else if (location === '/leaderboard') {
            return 'leaderboard';
        } else if (location === '/' || location === '/dashboard') {
            return 'dashboard';
        }
        return 'general';
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            // Get fresh context from localStorage
            const ctx = getAIContext();

            // Build context object
            const context = {
                page: getPageContext(),
                problemTitle: ctx?.problem?.problemTitle || null,
                problemDifficulty: ctx?.problem?.difficulty || null,
                userCode: ctx?.code || null,
            };

            console.log('Sending AI context:', {
                page: context.page,
                problem: context.problemTitle,
                codeLength: context.userCode?.length || 0
            });

            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    message: userMessage,
                    context
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!user) return null;

    const problemName = currentContext?.problem?.problemTitle;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
                    "bg-gradient-to-br from-primary to-purple-600 hover:scale-110",
                    "flex items-center justify-center",
                    "ring-4 ring-primary/20 hover:ring-primary/40",
                    isOpen && "rotate-90"
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed bottom-24 right-6 w-96 h-[500px] z-50",
                        "bg-card border border-border rounded-2xl shadow-2xl",
                        "flex flex-col overflow-hidden",
                        "animate-in slide-in-from-bottom-4 fade-in duration-300"
                    )}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white">CRYPTUS AI</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                    {problemName ? `Helping with: ${problemName}` : 'Your coding companion'}
                                </p>
                            </div>
                            {currentContext?.code && (
                                <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                                    Code synced
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex gap-3",
                                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        message.role === "user"
                                            ? "bg-primary/20 text-primary"
                                            : "bg-gradient-to-br from-primary to-purple-600"
                                    )}
                                >
                                    {message.role === "user" ? (
                                        <User className="w-4 h-4" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "max-w-[75%] rounded-2xl px-4 py-2",
                                        message.role === "user"
                                            ? "bg-primary text-white rounded-br-sm"
                                            : "bg-white/5 text-white rounded-bl-sm"
                                    )}
                                >
                                    <div className="text-sm whitespace-pre-wrap">
                                        {message.role === "assistant"
                                            ? renderFormattedMessage(message.content)
                                            : message.content
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-black/20">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={problemName ? "Ask about this problem..." : "Ask me anything..."}
                                className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className="rounded-xl bg-primary hover:bg-primary/80"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
