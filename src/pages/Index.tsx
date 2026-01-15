import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const RESPONSES: Record<string, string> = {
  explain: `I'd be happy to explain any coding concept! Here's how I approach explanations:

**1. Start with the "Why"**
Understanding the purpose helps you grasp the concept faster.

**2. Break it Down**
I'll divide complex topics into digestible parts.

**3. Use Examples**
Real-world code examples make abstract concepts concrete.

What concept would you like me to explain? Some popular topics:
• Closures in JavaScript
• React Hooks and their lifecycle
• REST vs GraphQL
• Design patterns like Factory or Observer`,

  code: `I'm ready to write code for you! I follow these principles:

**Clean Code Standards**
- Meaningful variable names
- Single responsibility functions
- Comprehensive comments

**Best Practices**
- Error handling
- Type safety (when applicable)
- Performance optimization

What would you like me to code? Examples:
• A React custom hook
• An API endpoint
• A sorting algorithm
• A database query`,

  debug: `Let's debug together! Share your code and I'll:

**1. Identify the Issue**
I'll analyze the code to find bugs, logic errors, or performance issues.

**2. Explain the Problem**
Understanding why something is broken helps prevent future bugs.

**3. Provide the Fix**
I'll give you corrected code with explanations.

**4. Suggest Improvements**
Often there are better ways to structure your code.

Paste your problematic code and describe what's happening vs. what you expect!`,

  architecture: `Software architecture is crucial! I can help with:

**System Design**
- Microservices vs Monolith
- Database selection
- Caching strategies
- Load balancing

**Code Architecture**
- Project structure
- Design patterns
- State management
- API design

**Best Practices**
- SOLID principles
- Clean architecture
- Testing strategies
- Documentation

What architectural challenge are you facing?`,

  default: `I'm here to help with your coding questions! I can:

• **Explain** programming concepts in depth
• **Write** clean, efficient code
• **Debug** and fix issues in your code
• **Guide** software architecture decisions

Just ask your question, and I'll provide practical, actionable solutions. Enable Deep Dive Mode for advanced techniques and detailed reasoning!`,
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [deepDiveMode, setDeepDiveMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);

    // Determine response based on keywords
    let responseKey = "default";
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("explain") || lowerMessage.includes("what is")) {
      responseKey = "explain";
    } else if (lowerMessage.includes("write") || lowerMessage.includes("create") || lowerMessage.includes("code")) {
      responseKey = "code";
    } else if (lowerMessage.includes("debug") || lowerMessage.includes("fix") || lowerMessage.includes("error")) {
      responseKey = "debug";
    } else if (lowerMessage.includes("architecture") || lowerMessage.includes("design") || lowerMessage.includes("structure")) {
      responseKey = "architecture";
    }

    let response = RESPONSES[responseKey];
    if (deepDiveMode) {
      response = `🔍 **Deep Dive Mode Enabled**\n\n${response}\n\n---\n\n**Advanced Insights:**\nWith Deep Dive Mode, I'll provide:\n• In-depth code analysis\n• Performance considerations\n• Edge cases and error handling\n• Industry best practices\n• Related concepts to explore`;
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
        },
      ]);
    }, 1500);
  };

  const handleSend = (message: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    simulateResponse(message);
  };

  const handleActionClick = (action: string) => {
    const prompts: Record<string, string> = {
      explain: "I'd like you to explain a coding concept to me",
      code: "Help me write some code",
      debug: "I need help debugging my code",
      architecture: "I need guidance on software architecture",
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
                />
              ))}
              {isTyping && (
                <ChatMessage role="assistant" content="" isTyping />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        deepDiveMode={deepDiveMode}
        onToggleDeepDive={() => setDeepDiveMode(!deepDiveMode)}
      />
    </div>
  );
};

export default Index;
