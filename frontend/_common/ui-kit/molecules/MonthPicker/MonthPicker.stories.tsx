import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MonthPicker from './MonthPicker';

const meta: Meta<typeof MonthPicker> = {
  title: 'Molecules/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type MonthPickerStory = StoryObj<typeof MonthPicker>;

function DefaultMonthPicker() {
  const [value, setValue] = useState('2025-03');
  return <MonthPicker value={value} onChange={setValue} />;
}

function MonthPickerWithLabelStory() {
  const [value, setValue] = useState('2025-03');
  return <MonthPicker value={value} onChange={setValue} label="Billing month" />;
}

function MonthPickerWithRangeStory() {
  const [value, setValue] = useState('2025-03');
  return (
    <MonthPicker
      value={value}
      onChange={setValue}
      label="Report period"
      minimumCalendarYear={2020}
      maximumCalendarYear={2030}
    />
  );
}

export const Default: MonthPickerStory = {
  render: () => <DefaultMonthPicker />,
};

export const WithLabel: MonthPickerStory = {
  render: () => <MonthPickerWithLabelStory />,
};

export const WithRange: MonthPickerStory = {
  render: () => <MonthPickerWithRangeStory />,
};
