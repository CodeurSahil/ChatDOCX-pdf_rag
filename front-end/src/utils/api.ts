// API configuration and utility functions

const API_BASE_URL = 'http://localhost:3000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  system_prompt: string;
  conversation_history: ChatMessage[];
  new_input: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
  conversation_history?: ChatMessage[];
  message_count?: number;
}

export const chatWithHistory = async (
  systemPrompt: string,
  conversationHistory: ChatMessage[],
  newInput: string
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat-with-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_prompt: systemPrompt,
        conversation_history: conversationHistory,
        new_input: newInput,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling chat API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const uploadDocument = async (file: File): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};
