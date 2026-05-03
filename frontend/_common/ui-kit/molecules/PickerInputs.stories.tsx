import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import DayPicker from './DayPicker/DayPicker';
import MonthPicker from './MonthPicker/MonthPicker';
import YearPicker from './YearPicker/YearPicker';

const meta: Meta = {
  title: 'Molecules/Calendar Pickers',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type PickerInputsStory = StoryObj;

export const CalendarPickers: PickerInputsStory = {
  render: () => {
    const [calendarDateInput, setCalendarDateInput] = useState('2026-05-03');
    const [calendarMonthInput, setCalendarMonthInput] = useState('2026-05');
    const [calendarYear, setCalendarYear] = useState(2026);

    return (
      <div className="flex max-w-md flex-col gap-5">
        <DayPicker
          value={calendarDateInput}
          onChange={setCalendarDateInput}
          label="Calendar day"
        />
        <MonthPicker
          value={calendarMonthInput}
          onChange={setCalendarMonthInput}
          label="Calendar month"
        />
        <YearPicker
          value={calendarYear}
          onChange={setCalendarYear}
          label="Calendar year"
        />
      </div>
    );
  },
};
