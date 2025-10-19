import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  animationDelay?: number;
  isLoading?: boolean;
}

const MessageBubble = ({ message, animationDelay = 0, isLoading = false }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} ${
        isUser ? "animate-slide-in-right" : "animate-slide-in-left"
      }`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-5 py-3 ${
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-glow"
            : "glass-effect text-foreground"
        }`}
      >
        <p className="text-sm leading-relaxed">
          {isLoading ? (
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </span>
          ) : (
            message.content
          )}
        </p>
        <p className={`text-xs mt-2 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
          <User className="w-5 h-5 text-foreground" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
