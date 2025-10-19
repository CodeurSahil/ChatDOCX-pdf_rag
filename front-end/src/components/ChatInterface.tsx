import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  fileName: string;
  uploadedAt: Date;
  onNewChat: () => void;
}

const ChatInterface = ({ fileName, uploadedAt, onNewChat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I've loaded "${fileName}". Ask me anything about this document and I'll help you find the information you need.`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. In a real implementation, this would be connected to your RAG backend API that processes the document and generates contextual responses based on the uploaded file.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hi! I've loaded "${fileName}". Ask me anything about this document and I'll help you find the information you need.`,
        timestamp: new Date(),
      },
    ]);
    onNewChat();
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <ChatHeader 
        fileName={fileName} 
        uploadedAt={uploadedAt}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              animationDelay={index * 0.1}
            />
          ))}
          {isLoading && (
            <MessageBubble
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
                timestamp: new Date(),
              }}
              isLoading
            />
          )}
        </div>
      </div>

      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
