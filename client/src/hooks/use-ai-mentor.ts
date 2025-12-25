import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Since chat routes might be in a separate file or dynamically added, 
// we will interface with the endpoints defined in the server integration directly here 
// for simplicity if not strictly typed in shared routes yet, or type them manually.

// Type definitions for the chat integration
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: number;
  title: string;
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      return res.json() as Promise<Conversation>;
    },
  });
}

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (conversationId: number, content: string) => {
    setIsLoading(true);
    // Add user message immediately for optimistic UI
    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to send message");

      // Handle SSE
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg: Message = { role: "assistant", content: "" };
      
      // Add empty assistant message to start accumulating
      setMessages((prev) => [...prev, assistantMsg]);

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                assistantMsg.content += data.content;
                // Update the LAST message in the array
                setMessages((prev) => {
                  const newPrev = [...prev];
                  newPrev[newPrev.length - 1] = { ...assistantMsg };
                  return newPrev;
                });
              }
              if (data.done) {
                // Stream finished
              }
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, setMessages };
}
