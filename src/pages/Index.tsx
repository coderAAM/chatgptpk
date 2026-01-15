import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import { streamChat } from "@/lib/chat";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveMode, setDeepDiveMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    // Create the assistant message placeholder
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const chatMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamChat({
      messages: chatMessages,
      deepDiveMode,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m
          )
        );
      },
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        // Remove the empty assistant message
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      },
    });
  };

  const handleActionClick = (action: string) => {
    const prompts: Record<string, string> = {
      explain: "Can you explain how closures work in JavaScript with practical examples?",
      code: "Write a React custom hook for handling form validation with TypeScript",
      debug: "Help me debug my code. I'll paste it in my next message.",
      architecture: "What are the key principles of clean architecture and how should I structure a React application?",
    };
    handleSend(prompts[action] || prompts.explain);
  };

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen onActionClick={handleActionClick} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isTyping={message.role === "assistant" && message.content === "" && isLoading}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        deepDiveMode={deepDiveMode}
        onToggleDeepDive={() => setDeepDiveMode(!deepDiveMode)}
      />
    </div>
  );
};

export default Index;
