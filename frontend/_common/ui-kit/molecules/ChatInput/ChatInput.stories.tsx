import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import ChatInput from './ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'Molecules/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type ChatInputStory = StoryObj<typeof ChatInput>;

function DefaultChatInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [composerText, setComposerText] = useState('');

  return (
    <ChatInput
      textareaReference={textareaRef}
      inputElementId="chat-input-default"
      composerText={composerText}
      setComposerText={setComposerText}
      streamingError={null}
      trimmedComposerLength={composerText.trim().length}
      requiresFirstMessageMinimum={false}
      patientChatMinimumMessageLength={10}
      charactersRemaining={0}
      canSend={composerText.length > 0}
      handleComposerKeyDown={() => {}}
      handleSend={() => {}}
    />
  );
}

function ChatInputWithErrorStory() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [composerText, setComposerText] = useState('');

  return (
    <ChatInput
      textareaReference={textareaRef}
      inputElementId="chat-input-error"
      composerText={composerText}
      setComposerText={setComposerText}
      streamingError="Connection error. Please try again."
      trimmedComposerLength={composerText.trim().length}
      requiresFirstMessageMinimum={false}
      patientChatMinimumMessageLength={10}
      charactersRemaining={0}
      canSend={composerText.length > 0}
      handleComposerKeyDown={() => {}}
      handleSend={() => {}}
    />
  );
}

function ChatInputWithMinimumLengthStory() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [composerText, setComposerText] = useState('');
  const minimumLength = 10;
  const trimmedLength = composerText.trim().length;

  return (
    <ChatInput
      textareaReference={textareaRef}
      inputElementId="chat-input-minimum"
      composerText={composerText}
      setComposerText={setComposerText}
      streamingError={null}
      trimmedComposerLength={trimmedLength}
      requiresFirstMessageMinimum={true}
      patientChatMinimumMessageLength={minimumLength}
      charactersRemaining={Math.max(0, minimumLength - trimmedLength)}
      canSend={trimmedLength >= minimumLength}
      handleComposerKeyDown={() => {}}
      handleSend={() => {}}
    />
  );
}

export const Default: ChatInputStory = {
  render: () => <DefaultChatInput />,
};

export const WithError: ChatInputStory = {
  render: () => <ChatInputWithErrorStory />,
};

export const WithMinimumLength: ChatInputStory = {
  render: () => <ChatInputWithMinimumLengthStory />,
};
