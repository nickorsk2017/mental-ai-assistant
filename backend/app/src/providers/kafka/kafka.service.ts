import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, logLevel, Producer } from 'kafkajs';

interface JournalChatPublishPayload {
  correlationId: string;
  userId: string;
  messageText: string;
  allowedActivityTags: readonly string[];
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer | null = null;

  private readonly chatTopic: string;

  constructor(private readonly configService: ConfigService) {
    this.chatTopic = this.configService.get<string>('KAFKA_CHAT_TOPIC') ?? 'serene.chat.requests';
  }

  async onModuleInit(): Promise<void> {
    const brokerList = this.configService.get<string>('KAFKA_BROKERS');
    const brokers = brokerList
      ?.split(',')
      .map((broker) => broker.trim())
      .filter((broker) => broker.length > 0);

    if (!brokers?.length) {
      return;
    }

    const kafka = new Kafka({
      clientId: 'serene-api',
      brokers,
      logLevel: logLevel.NOTHING,
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publishJournalChatRequest(payload: JournalChatPublishPayload): Promise<void> {
    if (!this.producer) {
      return;
    }

    const messageBody = JSON.stringify({
      correlationId: payload.correlationId,
      userId: payload.userId,
      messageText: payload.messageText,
      allowedActivityTags: payload.allowedActivityTags,
      requestedAt: new Date().toISOString(),
    });

    await this.producer.send({
      topic: this.chatTopic,
      messages: [{ key: payload.userId, value: messageBody }],
    });
  }
}
