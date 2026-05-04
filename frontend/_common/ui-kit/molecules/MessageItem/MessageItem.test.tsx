import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import MessageItem from './MessageItem';

describe('MessageItem', () => {
  const userMessage: Entity.PatientChatMessage = {
    role: 'user',
    content: 'Hello, how are you?',
  };

  const assistantMessage: Entity.PatientChatMessage = {
    role: 'assistant',
    content: 'I am doing well, thank you.',
  };

  it('renders user message text', () => {
    render(
      <MessageItem
        message={userMessage}
        isStreaming={false}
        isLastMessage={true}
      />
    );
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
  });

  it('renders assistant message text', () => {
    render(
      <MessageItem
        message={assistantMessage}
        isStreaming={false}
        isLastMessage={true}
      />
    );
    expect(screen.getByText('I am doing well, thank you.')).toBeInTheDocument();
  });

  it('shows pending indicator for empty streaming assistant message', () => {
    const streamingMessage: Entity.PatientChatMessage = {
      role: 'assistant',
      content: '',
    };
    render(
      <MessageItem
        message={streamingMessage}
        isStreaming={true}
        isLastMessage={true}
      />
    );
    expect(screen.getByText('…')).toBeInTheDocument();
  });
});
