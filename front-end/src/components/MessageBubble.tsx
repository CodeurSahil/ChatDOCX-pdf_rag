import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "./types/common";

interface MessageBubbleProps {
  message: ChatMessage;
  animationDelay?: number;
  isLoading?: boolean;
}

const MessageBubble = ({ message, animationDelay = 0, isLoading = false }: MessageBubbleProps) => {
  const isUser = message.sender === "user";

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
            : "glass-effect text-foreground border border-border/50 bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className={`text-sm leading-relaxed ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
          {isLoading ? (
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </span>
          ) : (
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                components={{
                p: ({ children }) => <p className={`mb-2 last:mb-0 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</p>,
                ul: ({ children }) => (
                  <ul className={`list-disc list-inside mb-3 space-y-2 pl-4 marker:text-primary/60 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className={`list-decimal list-inside mb-3 space-y-2 pl-4 marker:text-primary/60 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className={`text-sm leading-relaxed mb-1 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {children}
                  </li>
                ),
                code: ({ children, className }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return (
                    <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isUser ? 'bg-primary/30 text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className={`p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2 ${isUser ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className={`border-l-4 pl-4 my-2 italic ${isUser ? 'border-primary/70 text-primary-foreground/90' : 'border-border text-foreground/80'}`}>
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => <strong className={`font-semibold ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</strong>,
                em: ({ children }) => <em className={`italic ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</em>,
                h1: ({ children }) => <h1 className={`text-lg font-bold mb-2 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</h1>,
                h2: ({ children }) => <h2 className={`text-base font-bold mb-2 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</h2>,
                h3: ({ children }) => <h3 className={`text-sm font-bold mb-1 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{children}</h3>,
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className={`underline underline-offset-2 hover:no-underline ${isUser ? 'text-primary-foreground hover:text-primary-foreground/80' : 'text-primary hover:text-primary/80'}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-xs mt-2 ${isUser ? "text-primary-foreground/80" : "text-foreground/70"}`}>
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
