import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Molecules/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type TextAreaStory = StoryObj<typeof TextArea>;

export const Default: TextAreaStory = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Enter your message...',
    label: 'Message',
  },
};

export const WithValue: TextAreaStory = {
  args: {
    value: 'This is some example text in the textarea.',
    onChange: () => {},
    label: 'Notes',
  },
};

export const WithError: TextAreaStory = {
  args: {
    value: '',
    onChange: () => {},
    label: 'Description',
    errorMessage: 'This field is required',
  },
};

export const Interactive: TextAreaStory = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextArea
        value={value}
        onChange={setValue}
        label="Your thoughts"
        placeholder="Type something..."
        rows={4}
      />
    );
  },
};
