export interface ChatMessage {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export interface ChatBotMessage {
    role: "user" | "assistant";
    content: string;
}