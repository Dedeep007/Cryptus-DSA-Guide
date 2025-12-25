import { useState, useRef, useEffect } from "react";
import { useChatStream, useCreateConversation } from "@/hooks/use-ai-mentor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  X, 
  Loader2, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface AiMentorProps {
  context?: string; // Current problem context to feed the AI
}

export function AiMentor({ context }: AiMentorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  
  const { mutateAsync: createConversation } = useCreateConversation();
  const { messages, sendMessage, isLoading, setMessages } = useChatStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const content = input;
    setInput(""); // Clear input early

    try {
      let id = conversationId;
      if (!id) {
        const conv = await createConversation("New Mentorship Session");
        id = conv.id;
        setConversationId(id);
        
        // If context exists, send it silently first as a system-like prompt
        if (context) {
          await sendMessage(id, `I am currently working on this problem: ${context}. Please help me understand it without giving the full answer directly.`);
          // We might want to clear this specific message from UI or show it as context setting
          // For simplicity, we'll let it show or user can start normally
        }
      }
      
      if (id) {
        await sendMessage(id, content);
      }
    } catch (e) {
      console.error("Failed to start chat", e);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/25 flex items-center justify-center text-white",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Mentor</h3>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20"
              ref={scrollRef}
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-sm">Ask me anything about algorithms, data structures, or the code you're writing!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border border-white/5"
                    )}>
                      {msg.role === "assistant" ? (
                        <ReactMarkdown 
                          className="markdown-content prose prose-invert prose-sm max-w-none"
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-muted/50 border-white/10 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
