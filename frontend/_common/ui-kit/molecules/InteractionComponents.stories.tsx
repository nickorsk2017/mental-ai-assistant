import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';

import { Icon } from '../atoms/Icon/Icon';
import ChatInput from './ChatInput/ChatInput';
import Collapse from './Collapse/Collapse';
import MessageItem from './MessageItem/MessageItem';
import Modal from './Modal/Modal';
import PanelPageHeader from './PanelPageHeader/PanelPageHeader';
import { sampleChatMessages } from '../testing/UiKitFixtures';

const meta: Meta = {
  title: 'Molecules/Interactions',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type InteractionComponentsStory = StoryObj;

export const InteractionStates: InteractionComponentsStory = {
  render: () => {
    const [composerText, setComposerText] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const textareaReference = useRef<HTMLTextAreaElement | null>(null);

    return (
      <div className="flex max-w-2xl flex-col gap-6">
        <PanelPageHeader title="Notes" onPrimaryAction={() => undefined} primaryActionAriaLabel="Create note" />
        <div className="text-calm-text"><Icon name="calendar" /> Calendar icon</div>
        <Collapse header="Today" defaultOpen>
          <MessageItem message={sampleChatMessages[1]!} isStreaming={false} isLastMessage />
        </Collapse>
        <ChatInput
          textareaReference={textareaReference}
          inputElementId="storybook-chat-input"
          composerText={composerText}
          setComposerText={setComposerText}
          streamingError={null}
          trimmedComposerLength={composerText.trim().length}
          requiresFirstMessageMinimum
          patientChatMinimumMessageLength={50}
          charactersRemaining={Math.max(0, 50 - composerText.trim().length)}
          canSend={composerText.trim().length > 0}
          handleComposerKeyDown={() => undefined}
          handleSend={() => undefined}
        />
        <Modal isOpen={isOpen} title="Preview modal" onClose={() => setIsOpen(false)}>
          <p className="text-sm text-calm-text">Shared modal content rendered through a portal.</p>
        </Modal>
      </div>
    );
  },
};
