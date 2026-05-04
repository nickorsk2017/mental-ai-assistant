import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import ChatInput from './ChatInput';

function ChatInputTestWrapper() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [composerText, setComposerText] = React.useState('');
  const handleSend = jest.fn<() => void | Promise<void>>();

  return (
    <ChatInput
      textareaReference={textareaRef}
      inputElementId="test-input"
      composerText={composerText}
      setComposerText={setComposerText}
      streamingError={null}
      trimmedComposerLength={composerText.trim().length}
      requiresFirstMessageMinimum={false}
      patientChatMinimumMessageLength={10}
      charactersRemaining={0}
      canSend={composerText.length > 0}
      handleComposerKeyDown={() => {}}
      handleSend={handleSend}
    />
  );
}

describe('ChatInput', () => {
  it('renders textarea with placeholder', () => {
    render(<ChatInputTestWrapper />);
    expect(screen.getByPlaceholderText('Message for Mental Health…')).toBeInTheDocument();
  });

  it('updates text on textarea input', () => {
    render(<ChatInputTestWrapper />);
    const textarea = screen.getByPlaceholderText('Message for Mental Health…');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(textarea).toHaveValue('Hello');
  });

  it('enables send button when text is present', () => {
    const { rerender } = render(<ChatInputTestWrapper />);
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('disables send button when canSend is false', () => {
    render(
      <ChatInput
        textareaReference={{ current: null }}
        inputElementId="test-input"
        composerText="Text"
        setComposerText={() => {}}
        streamingError={null}
        trimmedComposerLength={4}
        requiresFirstMessageMinimum={false}
        patientChatMinimumMessageLength={10}
        charactersRemaining={0}
        canSend={false}
        handleComposerKeyDown={() => {}}
        handleSend={() => {}}
      />
    );
    expect(screen.getByLabelText('Send message')).toBeDisabled();
  });
});
