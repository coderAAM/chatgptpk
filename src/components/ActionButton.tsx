import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "accent";
}

const ActionButton = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        variant === "default"
          ? "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
          : "bg-accent/10 border-accent/30 hover:border-accent hover:bg-accent/20"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          variant === "default"
            ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
            : "bg-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
};

export default ActionButton;
