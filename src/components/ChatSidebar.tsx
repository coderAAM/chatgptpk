import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  Plus,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/conversations";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const ChatSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onSignOut,
  userEmail,
}: ChatSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col bg-secondary/50 border-r border-border transition-all duration-300",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        {!collapsed && (
          <Button
            onClick={onNewChat}
            size="sm"
            className="flex-1 mr-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        )}
        {collapsed && (
          <Button
            onClick={onNewChat}
            size="icon"
            variant="ghost"
            className="mx-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg cursor-pointer transition-colors",
                collapsed ? "p-2 justify-center" : "p-2 pr-1",
                currentConversationId === conv.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              )}
              onClick={() => onSelectConversation(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.updated_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {conversations.length === 0 && !collapsed && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No conversations yet
            </p>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed ? "justify-center" : ""
          )}
        >
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={onSignOut}
            className={cn("text-muted-foreground", !collapsed && "flex-1")}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>
        {!collapsed && userEmail && (
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {userEmail}
          </p>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
