import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  fileName: string;
  uploadedAt: Date | string;
  onNewChat: () => void;
}

const ChatHeader = ({ fileName, uploadedAt, onNewChat }: ChatHeaderProps) => {
  // Ensure uploadedAt is a Date object
  const date = uploadedAt instanceof Date ? uploadedAt : new Date(uploadedAt);
  
  // Check if date is valid
  const isValidDate = !isNaN(date.getTime());
  
  const formattedDate = isValidDate 
    ? date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown date';

  return (
    <header className="glass-effect border-b border-border/50 px-4 py-4 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <span className="text-primary">📄</span>
            {fileName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Uploaded on: {formattedDate}
          </p>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="bg-gradient-primary hover:scale-105 transition-all duration-300 hover:shadow-glow text-primary-foreground font-medium"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
