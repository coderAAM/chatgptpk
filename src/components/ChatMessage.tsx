import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
}

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
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
            </span>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
