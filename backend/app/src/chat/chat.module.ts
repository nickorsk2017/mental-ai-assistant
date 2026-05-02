import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { KafkaModule } from '../providers';
import { ChatHistoryService } from './chat-history.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthenticationModule, KafkaModule],
  controllers: [ChatController],
  providers: [ChatService, ChatHistoryService],
})
export class ChatModule {}
