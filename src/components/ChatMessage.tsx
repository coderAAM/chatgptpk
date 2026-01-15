import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

// Simple markdown-like renderer for code blocks
const renderContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const language = lines[0]?.trim() || "";
      const code = lines.slice(1).join("\n");
      
      return (
        <CodeBlock key={index} language={language} code={code} />
      );
    }
    
    // Handle inline code and bold
    const formatted = part
      .split(/(`[^`]+`)/g)
      .map((segment, i) => {
        if (segment.startsWith("`") && segment.endsWith("`")) {
          return (
            <code
              key={i}
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {segment.slice(1, -1)}
            </code>
          );
        }
        // Handle bold text
        return segment.split(/(\*\*[^*]+\*\*)/g).map((s, j) => {
          if (s.startsWith("**") && s.endsWith("**")) {
            return <strong key={`${i}-${j}`}>{s.slice(2, -2)}</strong>;
          }
          return s;
        });
      });
    
    return <span key={index}>{formatted}</span>;
  });
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="my-3 rounded-lg overflow-hidden bg-secondary/50 border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/80 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {language || "code"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
};

const ChatMessage = ({ role, content, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        role === "assistant" ? "bg-muted/50" : "bg-background"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
          role === "assistant"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <p className="text-sm font-medium text-foreground">
          {role === "assistant" ? "Lovable" : "You"}
        </p>
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {isTyping ? (
            <span className="inline-flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "75ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
            </span>
          ) : (
            renderContent(content)
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
