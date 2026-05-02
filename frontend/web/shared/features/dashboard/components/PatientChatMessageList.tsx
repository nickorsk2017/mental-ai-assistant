'use client';

import React from 'react';

import type { PatientChatMessage } from '../types/PatientChatTypes';

interface PatientChatMessageListProps {
  messages: PatientChatMessage[];
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
        const isAssistantRow = message.role === 'assistant';
        const isPendingAssistant =
          isAssistantRow && message.content.length === 0 && isStreaming && messageIndex === messages.length - 1;

        return (
          <div
            key={`${message.role}-${String(messageIndex)}`}
            className={`flex w-full ${isAssistantRow ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-[22px] px-4 py-3 text-left text-sm leading-7 ${
                isAssistantRow
                  ? 'border border-calm-border/50 bg-calm-surface/90 text-calm-text shadow-subtle'
                  : 'bg-calm-second/18 text-calm-text'
              }`}
            >
              {isPendingAssistant ? (
                <span className="text-calm-muted">…</span>
              ) : (
                <span className="whitespace-pre-wrap">{message.content}</span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndReference} />
    </div>
  );
});

export default PatientChatMessageList;
