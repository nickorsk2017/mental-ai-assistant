import React from 'react';

import { MessageItem } from '@common/shared/ui-kit';

interface MessageListProps {
  messages: Entity.PatientChatMessage[];
  isStreaming: boolean;
  messagesEndReference: React.RefObject<HTMLDivElement | null>;
}

const MessageList = React.memo(function MessageList({
  messages,
  isStreaming,
  messagesEndReference,
}: MessageListProps) {
  return (
    <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-4 px-4 py-6">
      {messages.map((message, messageIndex) => (
        <MessageItem
          key={`${message.role}-${String(messageIndex)}`}
          message={message}
          isStreaming={isStreaming}
          isLastMessage={messageIndex === messages.length - 1}
        />
      ))}
      <div ref={messagesEndReference} />
    </div>
  );
});

export default MessageList;
