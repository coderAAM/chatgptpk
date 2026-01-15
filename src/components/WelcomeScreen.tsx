import { BookOpen, Code, Bug, Layers } from "lucide-react";
import ActionButton from "./ActionButton";

interface WelcomeScreenProps {
  onActionClick: (action: string) => void;
}

const WelcomeScreen = ({ onActionClick }: WelcomeScreenProps) => {
  const actions = [
    {
      icon: BookOpen,
      label: "Explain Concept",
      description: "Deep, step-by-step explanations",
      action: "explain",
      variant: "default" as const,
    },
    {
      icon: Code,
      label: "Write Code",
      description: "Generate clean, efficient code",
      action: "code",
      variant: "default" as const,
    },
    {
      icon: Bug,
      label: "Debug Code",
      description: "Identify issues and suggest fixes",
      action: "debug",
      variant: "default" as const,
    },
    {
      icon: Layers,
      label: "Architecture",
      description: "Software design guidance",
      action: "architecture",
      variant: "accent" as const,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Code className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            How can I help you code today?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            I'm your AI coding companion. Ask me anything about programming, debugging,
            or software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <ActionButton
              key={action.action}
              icon={action.icon}
              label={action.label}
              description={action.description}
              variant={action.variant}
              onClick={() => onActionClick(action.action)}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Enable <span className="font-medium text-accent">Deep Dive Mode</span> for
          in-depth reasoning and advanced techniques
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
