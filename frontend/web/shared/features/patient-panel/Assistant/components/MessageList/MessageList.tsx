'use client';

import React from 'react';

import { MessageItem } from '@common/shared/ui-kit';

interface PatientChatMessageListProps {
  messages: Entity.PatientChatMessage[];
  isStreaming: boolean;
  messagesEndReference: React.RefObject<HTMLDivElement | null>;
}

const PatientChatMessageList = React.memo(function PatientChatMessageList({
  messages,
  isStreaming,
  messagesEndReference,
}: PatientChatMessageListProps) {
  return (
    <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-4 px-4 py-8 sm:px-6">
      {messages.map((message, messageIndex) => {
        return (
          <MessageItem
            key={`${message.role}-${String(messageIndex)}`}
            message={message}
            isStreaming={isStreaming}
            isLastMessage={messageIndex === messages.length - 1}
          />
        );
      })}
      <div ref={messagesEndReference} />
    </div>
  );
});

export default PatientChatMessageList;
