import React from 'react';

interface MessageItemProps {
  message: Entity.PatientChatMessage;
  isStreaming: boolean;
  isLastMessage: boolean;
}

const MessageItem = React.memo(function MessageItem({
  message,
  isStreaming,
  isLastMessage,
}: MessageItemProps) {
  const isAssistantRow = message.role === 'assistant';
  const isPendingAssistant =
    isAssistantRow && message.content.length === 0 && isStreaming && isLastMessage;

  return (
    <div className={`flex w-full ${isAssistantRow ? 'justify-start' : 'justify-end'}`}>
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
});

export default MessageItem;
