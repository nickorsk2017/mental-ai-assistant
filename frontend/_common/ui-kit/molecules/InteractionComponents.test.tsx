import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import ChatInput from './ChatInput/ChatInput';
import Collapse from './Collapse/Collapse';
import MessageItem from './MessageItem/MessageItem';
import Modal from './Modal/Modal';
import PanelPageHeader from './PanelPageHeader/PanelPageHeader';

describe('Interaction molecules', () => {
  it('toggles collapse visibility from the header button', () => {
    render(
      <Collapse header="Today">
        <div>Hidden note</div>
      </Collapse>,
    );

    const headerButton = screen.getByRole('button', { name: 'Today' });
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');

    const panel = screen.getByRole('region', { hidden: true });
    expect(panel).not.toBeVisible();

    fireEvent.click(headerButton);

    expect(headerButton).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeVisible();
    expect(screen.getByText('Hidden note')).toBeTruthy();
  });

  it('calls send when the chat button is pressed', () => {
    const handleSend: () => void = jest.fn();
    const textareaReference = { current: null };
    render(
      <ChatInput
        textareaReference={textareaReference}
        inputElementId="chat-input"
        composerText="Hello there"
        setComposerText={() => undefined}
        streamingError={null}
        trimmedComposerLength={11}
        requiresFirstMessageMinimum={false}
        patientChatMinimumMessageLength={50}
        charactersRemaining={0}
        canSend
        handleComposerKeyDown={() => undefined}
        handleSend={handleSend}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(handleSend).toHaveBeenCalled();
  });

  it('renders the pending assistant placeholder while streaming', () => {
    render(
      <MessageItem
        message={{ role: 'assistant', content: '' }}
        isStreaming
        isLastMessage
      />,
    );

    expect(screen.getByText('…')).toBeTruthy();
  });

  it('closes the modal from the header close button', () => {
    const onClose = jest.fn();
    render(<Modal isOpen title="Preview" onClose={onClose}><div>Body</div></Modal>);

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('triggers the primary page action button', () => {
    const onPrimaryAction = jest.fn();
    render(<PanelPageHeader title="Notes" onPrimaryAction={onPrimaryAction} primaryActionAriaLabel="Create note" />);

    fireEvent.click(screen.getByRole('button', { name: 'Create note' }));
    expect(onPrimaryAction).toHaveBeenCalled();
  });
});
