import { ChatService } from './chat.service';

describe('ChatService', () => {
  it('validates the minimum journal message length after trimming', () => {
    const chatService = new ChatService(
      {} as never,
      {} as never,
      {} as never,
    );

    expect(chatService.validateJournalMessageLength('a'.repeat(50))).toBe(true);
    expect(chatService.validateJournalMessageLength(`   ${'a'.repeat(50)}   `)).toBe(true);
    expect(chatService.validateJournalMessageLength('a'.repeat(49))).toBe(false);
  });
});
