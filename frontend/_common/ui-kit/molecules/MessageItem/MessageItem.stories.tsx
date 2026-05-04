import type { Meta, StoryObj } from '@storybook/react';
import MessageItem from './MessageItem';

const meta: Meta<typeof MessageItem> = {
  title: 'Molecules/MessageItem',
  component: MessageItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type MessageItemStory = StoryObj<typeof MessageItem>;

export const UserMessage: MessageItemStory = {
  args: {
    message: {
      role: 'user',
      content: 'How can I improve my mood today?',
    },
    isStreaming: false,
    isLastMessage: true,
  },
};

export const AssistantMessage: MessageItemStory = {
  args: {
    message: {
      role: 'assistant',
      content: 'Try taking a short walk, spending time in nature, or connecting with a friend.',
    },
    isStreaming: false,
    isLastMessage: true,
  },
};

export const StreamingMessage: MessageItemStory = {
  args: {
    message: {
      role: 'assistant',
      content: '',
    },
    isStreaming: true,
    isLastMessage: true,
  },
};

export const MultilineMessage: MessageItemStory = {
  args: {
    message: {
      role: 'assistant',
      content: 'Here are some suggestions:\n1. Exercise\n2. Meditate\n3. Talk to someone you trust',
    },
    isStreaming: false,
    isLastMessage: true,
  },
};
