import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Molecules/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'password'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};

export default meta;
type TextInputStory = StoryObj<typeof TextInput>;

function StatefulTemplate(args: React.ComponentProps<typeof TextInput>) {
  const [value, setValue] = useState(args.value ?? '');
  return <TextInput {...args} value={value} onChange={setValue} />;
}

export const Text: TextInputStory = {
  render: (args) => <StatefulTemplate {...args} />,
  args: { label: 'Email', placeholder: 'you@example.com', value: '', type: 'text', size: 'medium' },
};

export const Password: TextInputStory = {
  render: (args) => <StatefulTemplate {...args} />,
  args: { label: 'Password', placeholder: 'Enter password', value: '', type: 'password', size: 'medium' },
};

export const ErrorDark: TextInputStory = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    value: '123',
    type: 'password',
    size: 'large',
    errorMessage: 'Password must be at least 8 characters',
  },
};
