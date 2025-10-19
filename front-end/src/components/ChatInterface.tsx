import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { ChatMessage, ChatBotMessage } from "./types/common";

interface ChatInterfaceProps {
  fileName: string;
  uploadedAt: Date;
  onNewChat: () => void;
  initialChat: ChatMessage;
  collectionName?: string;
}

const ChatInterface = ({ fileName, uploadedAt, onNewChat, initialChat, collectionName }: ChatInterfaceProps) => {
  console.log("initialChat", initialChat);
  console.log("fileName", fileName);
  console.log("uploadedAt", uploadedAt);
  console.log("initialChat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth"
    });
  };

  useEffect(() => {
    console.log("messages", messages);
    if (messages.length > 0) {
      localStorage.setItem('chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll when messages change
  useEffect(() => {
    // Small delay to ensure DOM updates are complete
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as ChatMessage[];
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          // Convert string dates back to Date objects
          const processedMessages = parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(processedMessages);
        }
      } catch (error) {
        console.error("Error parsing chat history:", error);
      }
    } else {
      setMessages([initialChat]);
    }
  }, [initialChat]);

  const handleSendMessage = async (inputMessage: string) => {
    console.log("inputMessage", inputMessage);
    if (!inputMessage.trim()) return;

    const chatBotMes = [];

    for (const message of messages) {
      const chatMessage: ChatBotMessage = {
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text
      };

      chatBotMes.push(chatMessage);
    };

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    const chatMessage: ChatBotMessage = {
      role: "user",
      content: inputMessage
    };

    chatBotMes.push(chatMessage);
    console.log("chatBotMes", chatBotMes);

    setMessages((prev) => [...prev, userMessage]);
    // setInputMessage("");
    setIsLoading(true);

    const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

    console.log("BACK_END_URL", BACK_END_URL);

    try {
      const res = await fetch(`${BACK_END_URL}/chat`, {
        method: "POST",
        body: JSON.stringify({ 
          content: chatBotMes, 
          collection_name: collectionName 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();

        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);

      } else {
        toast({
          title: "Message Failed!",
          description: "Something Went Wrong. Please try Again Later.",
          variant: "destructive",
          duration: 5000
        });
      }

    } catch (error) {
      toast({
        title: "Message Failed!",
        description: "Something Went Wrong. Please try Again Later.",
        variant: "destructive",
        duration: 5000
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <ChatHeader 
        fileName={fileName} 
        uploadedAt={uploadedAt}
        onNewChat={onNewChat}
      />
      
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" style={{ paddingBottom: "8rem" }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message: ChatMessage, index: number) => (
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
                sender: "bot",
                text: "Thinking...",
                timestamp: new Date(),
              }}
              isLoading
            />
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;