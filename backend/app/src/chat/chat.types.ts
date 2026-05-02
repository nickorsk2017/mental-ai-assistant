export interface ChatStreamRequestBody {
  messageText: string;
  enforceMinimumLength?: boolean;
  clientLocalDate?: string;
  clientTimeZone?: string;
}

export interface ChatMessageRecord {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatDateContext {
  clientLocalDate?: string;
  clientTimeZone?: string;
}
