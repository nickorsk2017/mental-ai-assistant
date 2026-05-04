export {};

declare global {
  namespace Entity {
    interface ChatStreamRequestBody {
      messageText: string;
      enforceMinimumLength?: boolean;
      clientLocalDate?: string;
      clientTimeZone?: string;
    }

    interface ChatMessageRecord {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      createdAt: string;
    }

    interface ChatDateContext {
      clientLocalDate?: string;
      clientTimeZone?: string;
    }
  }
}
