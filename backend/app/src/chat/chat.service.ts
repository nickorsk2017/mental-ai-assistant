import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { randomUUID } from 'crypto';
import { PATIENT_ACTIVITY_TAGS } from '../constants/patient-activity-tags.constants';
import { KafkaService } from '../providers';
import { ChatHistoryService } from './chat-history.service';
import type { ChatDateContext, ChatMessageRecord } from './chat.types';

const minimumJournalMessageLength = 50;

const streamFallbackChunks = [
  'Thank you for sharing your day. ',
  'Your note was queued for the Serene pipeline. ',
  'When the AI service finishes, structured tags and timestamps ',
  'will be saved to PostgreSQL and Pinecone.',
] as const;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    private readonly chatHistoryService: ChatHistoryService,
  ) {}

  validateJournalMessageLength(messageText: string): boolean {
    return messageText.trim().length >= minimumJournalMessageLength;
  }

  private resolveAiAgentsBaseUrl(): string {
    const explicitBaseUrl = this.configService.get<string>('AI_AGENTS_BASE_URL')?.trim();

    if (explicitBaseUrl) {
      return explicitBaseUrl;
    }

    const portValue = this.configService.get<string | number>('AI_AGENTS_PORT');
    const parsedPort =
      typeof portValue === 'number' && Number.isFinite(portValue)
        ? portValue
        : Number.parseInt(String(portValue ?? ''), 10) || 8080;

    return `http://127.0.0.1:${parsedPort}`;
  }

  async listTodayMessages(
    userId: string,
    dateContext: ChatDateContext,
  ): Promise<ChatMessageRecord[]> {
    return this.chatHistoryService.listTodayMessages(userId, dateContext);
  }

  async streamAssistantReply(
    response: Response,
    userId: string,
    messageText: string,
    enforceMinimumLength: boolean,
    dateContext: ChatDateContext,
  ): Promise<void> {
    const correlationId = randomUUID();

    await this.chatHistoryService.saveChatMessage(userId, 'user', messageText);
    const dailyMessages = await this.chatHistoryService.listTodayMessages(userId, dateContext);

    try {
      await this.kafkaService.publishJournalChatRequest({
        correlationId,
        userId,
        messageText,
        allowedActivityTags: PATIENT_ACTIVITY_TAGS,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.warn(`Kafka publish failed (async journaling may be delayed): ${errorMessage}`);
    }

    const baseUrl = this.resolveAiAgentsBaseUrl();
    const streamUrl = `${baseUrl.replace(/\/$/, '')}/chat/messages/stream`;

    try {
      const upstreamResponse = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          messageText,
          enforceMinimumLength,
          dailyMessages,
          clientLocalDate: dateContext.clientLocalDate,
          clientTimeZone: dateContext.clientTimeZone,
        }),
      });

      if (!upstreamResponse.ok || !upstreamResponse.body) {
        this.logger.warn(
          `AI agents HTTP ${upstreamResponse.status}; streaming fallback copy.`,
        );
        const fallbackReply = await this.writeFallbackAssistantStream(response);

        await this.chatHistoryService.saveChatMessage(userId, 'assistant', fallbackReply);
        response.end();

        return;
      }

      const reader = upstreamResponse.body.getReader();
      let assistantReply = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          if (value && value.byteLength > 0) {
            const chunk = Buffer.from(value);

            assistantReply += chunk.toString('utf8');
            response.write(chunk);
          }
        }
      } finally {
        reader.releaseLock();
      }

      if (assistantReply.trim().length > 0) {
        await this.chatHistoryService.saveChatMessage(userId, 'assistant', assistantReply);
      }

      response.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.logger.warn(`AI agents stream failed: ${errorMessage}`);
      const fallbackReply = await this.writeFallbackAssistantStream(response);

      await this.chatHistoryService.saveChatMessage(userId, 'assistant', fallbackReply);
      response.end();
    }
  }

  private async writeFallbackAssistantStream(response: Response): Promise<string> {
    let fallbackReply = '';

    for (const chunk of streamFallbackChunks) {
      fallbackReply += chunk;
      response.write(chunk);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 70);
      });
    }

    return fallbackReply;
  }
}
