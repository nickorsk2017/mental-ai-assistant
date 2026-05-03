import { Body, Controller, Get, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SupabaseAuthenticationGuard } from '../authentication/supabase-authentication.guard';
import { ChatService } from './chat.service';

function buildChatDateContext(
  clientLocalDate?: string,
  clientTimeZone?: string,
): Entity.ChatDateContext {
  return { clientLocalDate, clientTimeZone };
}

@Controller('chat')
@UseGuards(SupabaseAuthenticationGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/today')
  async listTodayMessages(
    @Headers('x-user-id') userId: string,
    @Headers('x-client-local-date') clientLocalDate?: string,
    @Headers('x-client-time-zone') clientTimeZone?: string,
  ) {
    const messages = await this.chatService.listTodayMessages(
      userId,
      buildChatDateContext(clientLocalDate, clientTimeZone),
    );

    return { success: true, data: messages, error: null };
  }

  /**
   * Streams a plain-text assistant reply from the AI agents service (REST). The same journal payload
   * is published to Kafka so the consumer can persist Pinecone vectors and Supabase notes asynchronously.
   */
  @Post('messages/stream')
  async streamJournalMessage(
    @Body() body: Entity.ChatStreamRequestBody,
    @Headers('x-user-id') userId: string,
    @Res() response: Response,
  ): Promise<void> {
    const trimmed = body.messageText?.trim() ?? '';
    const enforceMinimumLength = body.enforceMinimumLength ?? true;

    if (trimmed.length === 0) {
      response.status(400).json({
        success: false,
        data: null as null,
        error: 'Message is required.',
      });

      return;
    }

    if (enforceMinimumLength && !this.chatService.validateJournalMessageLength(trimmed)) {
      response.status(400).json({
        success: false,
        data: null as null,
        error: 'Message must be at least 50 characters.',
      });

      return;
    }

    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('X-Accel-Buffering', 'no');

    await this.chatService.streamAssistantReply(response, userId, trimmed, enforceMinimumLength, {
      clientLocalDate: body.clientLocalDate,
      clientTimeZone: body.clientTimeZone,
    });
  }
}
