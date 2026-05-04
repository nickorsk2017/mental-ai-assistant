import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DayPicker from './DayPicker';

const meta: Meta<typeof DayPicker> = {
  title: 'Molecules/DayPicker',
  component: DayPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type DayPickerStory = StoryObj<typeof DayPicker>;

function DefaultDayPicker() {
  const [value, setValue] = useState('2025-03-15');
  return <DayPicker value={value} onChange={setValue} />;
}

function DayPickerWithLabelStory() {
  const [value, setValue] = useState('2025-03-15');
  return <DayPicker value={value} onChange={setValue} label="Pick a date" />;
}

function WithDifferentDate() {
  const [value, setValue] = useState('2025-12-25');
  return <DayPicker value={value} onChange={setValue} label="Holiday" />;
}

export const Default: DayPickerStory = {
  render: () => <DefaultDayPicker />,
};

export const WithLabel: DayPickerStory = {
  render: () => <DayPickerWithLabelStory />,
};

export const DifferentDate: DayPickerStory = {
  render: () => <WithDifferentDate />,
};
