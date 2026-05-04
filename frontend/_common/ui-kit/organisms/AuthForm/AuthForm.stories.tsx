import type { Meta, StoryObj } from '@storybook/react';
import { AuthForm } from './AuthForm';

const meta: Meta<typeof AuthForm> = {
  title: 'Organisms/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type AuthFormStory = StoryObj<typeof AuthForm>;

export const Default: AuthFormStory = {
  args: {},
};

export const WithClassName: AuthFormStory = {
  args: {
    className: 'rounded-lg shadow-lg',
  },
};
