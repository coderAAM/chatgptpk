import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatSidebar from "@/components/ChatSidebar";
import { streamChat } from "@/lib/chat";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  createConversation,
  getConversations,
  getMessages,
  addMessage,
  updateMessage,
  updateConversationTitle,
  deleteConversation,
  type Conversation,
  type Message,
} from "@/lib/conversations";

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveMode, setDeepDiveMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) {
        setMessages([]);
        return;
      }
      try {
        const msgs = await getMessages(currentConversationId);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    loadMessages();
  }, [currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setMessages([]);
      }
      toast({ title: "Conversation deleted" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const handleSend = async (message: string) => {
    if (!user) return;

    setIsLoading(true);
    let conversationId = currentConversationId;

    try {
      // Create new conversation if needed
      if (!conversationId) {
        const newConv = await createConversation(user.id, message.slice(0, 50));
        conversationId = newConv.id;
        setCurrentConversationId(conversationId);
        setConversations((prev) => [newConv, ...prev]);
      }

      // Add user message to database
      const userMsg = await addMessage(conversationId, "user", message);
      setMessages((prev) => [...prev, userMsg]);

      // Create placeholder assistant message
      const assistantPlaceholder = await addMessage(conversationId, "assistant", "");
      setMessages((prev) => [...prev, assistantPlaceholder]);

      let assistantContent = "";

      // Prepare messages for API (exclude the empty placeholder)
      const chatMessages = [...messages, userMsg].map((m) => ({
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
              m.id === assistantPlaceholder.id ? { ...m, content: assistantContent } : m
            )
          );
        },
        onDone: async () => {
          // Update the message in the database
          await updateMessage(assistantPlaceholder.id, assistantContent);
          
          // Update conversation title if it's the first message
          if (messages.length === 0) {
            const title = message.slice(0, 50) + (message.length > 50 ? "..." : "");
            await updateConversationTitle(conversationId!, title);
            setConversations((prev) =>
              prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
            );
          }
          
          setIsLoading(false);
          loadConversations(); // Refresh to update timestamps
        },
        onError: async (error) => {
          setIsLoading(false);
          // Remove the empty assistant message
          setMessages((prev) => prev.filter((m) => m.id !== assistantPlaceholder.id));
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const showWelcome = messages.length === 0;

  return (
    <div className="flex min-h-screen bg-background">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onSignOut={handleSignOut}
        userEmail={user.email}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
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
                    isTyping={
                      message.role === "assistant" &&
                      message.content === "" &&
                      isLoading
                    }
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
    </div>
  );
};

export default Index;
