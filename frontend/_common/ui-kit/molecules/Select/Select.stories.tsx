import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Molecules/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type SelectStory = StoryObj<typeof Select>;

const options = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

function ControlledSelect() {
  const [value, setValue] = useState('');
  return <Select value={value} onChange={setValue} options={options} placeholder="Select an option" />;
}

function ControlledSelectWithLabel() {
  const [value, setValue] = useState('');
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      label="Choose one"
      placeholder="Pick something"
    />
  );
}

function ControlledSelectMultiple() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      multiple
      placeholder="Select multiple"
    />
  );
}

function ControlledSelectWithError() {
  const [value, setValue] = useState('');
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      placeholder="Select"
      errorMessage="This field is required"
    />
  );
}

export const Default: SelectStory = {
  render: () => <ControlledSelect />,
};

export const WithLabel: SelectStory = {
  render: () => <ControlledSelectWithLabel />,
};

export const Multiple: SelectStory = {
  render: () => <ControlledSelectMultiple />,
};

export const WithError: SelectStory = {
  render: () => <ControlledSelectWithError />,
};
