import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import YearPicker from './YearPicker';

const meta: Meta<typeof YearPicker> = {
  title: 'Molecules/YearPicker',
  component: YearPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type YearPickerStory = StoryObj<typeof YearPicker>;

function DefaultYearPicker() {
  const [value, setValue] = useState(2025);
  return <YearPicker value={value} onChange={setValue} />;
}

function YearPickerWithLabelStory() {
  const [value, setValue] = useState(2025);
  return <YearPicker value={value} onChange={setValue} label="Fiscal year" />;
}

function YearPickerWithRangeStory() {
  const [value, setValue] = useState(2025);
  return (
    <YearPicker
      value={value}
      onChange={setValue}
      label="Birth year"
      minimumCalendarYear={1950}
      maximumCalendarYear={2020}
    />
  );
}

export const Default: YearPickerStory = {
  render: () => <DefaultYearPicker />,
};

export const WithLabel: YearPickerStory = {
  render: () => <YearPickerWithLabelStory />,
};

export const WithRange: YearPickerStory = {
  render: () => <YearPickerWithRangeStory />,
};
