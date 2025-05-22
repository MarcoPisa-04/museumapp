export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: {
    response: string;
  };
}

export interface Message {
  type: 'text';
  content: string;
  sender: 'user' | 'bot';
} 