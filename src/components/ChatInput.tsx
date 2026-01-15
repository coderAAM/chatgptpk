import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  deepDiveMode: boolean;
  onToggleDeepDive: () => void;
}

const ChatInput = ({ onSend, disabled, deepDiveMode, onToggleDeepDive }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask a coding question..."
              className={cn(
                "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "min-h-[52px] max-h-[200px] transition-all duration-200"
              )}
              rows={1}
              disabled={disabled}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || disabled}
              className={cn(
                "absolute right-2 bottom-2 h-8 w-8 rounded-lg",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant={deepDiveMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleDeepDive}
            className={cn(
              "flex items-center gap-2 rounded-xl h-[52px] px-4 transition-all",
              deepDiveMode && "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Deep Dive</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {deepDiveMode
            ? "Deep Dive Mode: Detailed explanations with advanced techniques"
            : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
