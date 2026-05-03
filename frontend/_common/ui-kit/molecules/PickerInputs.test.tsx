import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import DayPicker from './DayPicker/DayPicker';
import MonthPicker from './MonthPicker/MonthPicker';
import YearPicker from './YearPicker/YearPicker';

describe('Calendar picker molecules', () => {
  it('opens the day picker dialog', () => {
    render(<DayPicker value="2026-05-03" onChange={() => undefined} label="Calendar day" />);

    fireEvent.click(screen.getByLabelText('Calendar day'));

    expect(screen.getByRole('dialog', { name: 'Choose calendar day' })).toBeTruthy();
  });

  it('opens the month picker dialog', () => {
    render(<MonthPicker value="2026-05" onChange={() => undefined} label="Calendar month" />);

    fireEvent.click(screen.getByLabelText('Calendar month'));

    expect(screen.getByRole('dialog', { name: 'Choose calendar month' })).toBeTruthy();
  });

  it('changes the year when a new cell is selected', () => {
    const onChange = jest.fn();
    render(<YearPicker value={2026} onChange={onChange} label="Calendar year" />);

    fireEvent.click(screen.getByLabelText('Calendar year'));
    fireEvent.click(screen.getByRole('button', { name: '2025' }));

    expect(onChange).toHaveBeenCalledWith(2025);
  });
});
