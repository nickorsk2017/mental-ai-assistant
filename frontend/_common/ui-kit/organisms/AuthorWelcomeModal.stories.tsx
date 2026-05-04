import type { Meta, StoryObj } from '@storybook/react';
import AuthorWelcomeModal from './AuthorWelcomeModal';

const meta: Meta<typeof AuthorWelcomeModal> = {
  title: 'Organisms/AuthorWelcomeModal',
  component: AuthorWelcomeModal,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type AuthorWelcomeModalStory = StoryObj<typeof AuthorWelcomeModal>;

export const WithUserNotSeen: AuthorWelcomeModalStory = {
  args: {
    userId: 'demo-user-123',
  },
  beforeEach: () => {
    localStorage.clear();
  },
};

export const WithoutUser: AuthorWelcomeModalStory = {
  args: {
    userId: null,
  },
};
