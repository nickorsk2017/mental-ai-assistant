import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../providers';
import type { ChatDateContext, ChatMessageRecord } from './chat.types';

const firstChatMessageContent =
  'I am your mental health assistant. Describe how you feel today and rate your mood from 1 to 10. I will create notes about your health and track your state in your journal.';

const returningChatMessageContent =
  'Good day. How are you feeling today? Please rate your mood from 1 to 10.';
const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class ChatHistoryService {
  private readonly logger = new Logger(ChatHistoryService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private resolveServerTodayBounds(): { start: string; end: string } {
    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);

    endDate.setDate(startDate.getDate() + 1);

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };
  }

  private resolveOffsetInMilliseconds(date: Date, timeZone: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((part) => [part.type, part.value]),
    );
    const normalizedHour = parts.hour === '24' ? '00' : parts.hour;
    const localTimeAsUniversal = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(normalizedHour),
      Number(parts.minute),
      Number(parts.second),
    );

    return localTimeAsUniversal - date.getTime();
  }

  private buildUniversalDateFromLocalDate(
    localDate: string,
    timeZone: string,
    additionalDays = 0,
  ): Date {
    const [yearText, monthText, dayText] = localDate.split('-');
    const universalGuess = new Date(
      Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText) + additionalDays),
    );
    const offset = this.resolveOffsetInMilliseconds(universalGuess, timeZone);

    return new Date(universalGuess.getTime() - offset);
  }

  private resolveClientTodayBounds(
    dateContext: ChatDateContext,
  ): { start: string; end: string } | null {
    const { clientLocalDate, clientTimeZone } = dateContext;

    if (!clientLocalDate || !clientTimeZone || !localDatePattern.test(clientLocalDate)) {
      return null;
    }

    try {
      new Intl.DateTimeFormat('en-US', { timeZone: clientTimeZone }).format(new Date());

      return {
        start: this.buildUniversalDateFromLocalDate(clientLocalDate, clientTimeZone).toISOString(),
        end: this.buildUniversalDateFromLocalDate(clientLocalDate, clientTimeZone, 1).toISOString(),
      };
    } catch {
      return null;
    }
  }

  private resolveTodayBounds(dateContext: ChatDateContext): { start: string; end: string } {
    return this.resolveClientTodayBounds(dateContext) ?? this.resolveServerTodayBounds();
  }

  async listTodayMessages(
    userId: string,
    dateContext: ChatDateContext,
  ): Promise<ChatMessageRecord[]> {
    const { start, end } = this.resolveTodayBounds(dateContext);
    const { data, error } = await this.supabaseService.adminClient
      .from('patient_chat_messages')
      .select('id, role, content, created_at')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lt('created_at', end)
      .order('created_at', { ascending: true });

    if (error) {
      this.logger.warn(`Failed to load chat history: ${error.message}`);

      return [await this.buildEmptyTodayMessage(userId)];
    }

    const todayMessages: ChatMessageRecord[] = (data ?? []).map((message) => {
      const role: ChatMessageRecord['role'] = message.role === 'assistant' ? 'assistant' : 'user';

      return {
        id: String(message.id),
        role,
        content: String(message.content ?? ''),
        createdAt: String(message.created_at),
      };
    });

    return todayMessages.length > 0 ? todayMessages : [await this.buildEmptyTodayMessage(userId)];
  }

  async saveChatMessage(
    userId: string,
    role: 'user' | 'assistant',
    content: string,
  ): Promise<void> {
    const { error } = await this.supabaseService.adminClient
      .from('patient_chat_messages')
      .insert({ user_id: userId, role, content });

    if (error) {
      this.logger.warn(`Failed to save ${role} chat message: ${error.message}`);
    }
  }

  private async buildEmptyTodayMessage(userId: string): Promise<ChatMessageRecord> {
    const { count, error } = await this.supabaseService.adminClient
      .from('patient_chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      this.logger.warn(`Failed to inspect previous chat history: ${error.message}`);
    }

    const hasPreviousMessages = (count ?? 0) > 0;

    return {
      id: 'serene-empty-today-message',
      role: 'assistant',
      content: hasPreviousMessages ? returningChatMessageContent : firstChatMessageContent,
      createdAt: new Date().toISOString(),
    };
  }
}
