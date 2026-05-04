import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import MonthPicker from './MonthPicker';

describe('MonthPicker', () => {
  const testMonth = '2025-03';

  it('renders trigger button with month and year', () => {
    const handleChange = jest.fn();
    render(
      <MonthPicker
        value={testMonth}
        onChange={handleChange}
        label="Select a month"
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Select a month')).toBeInTheDocument();
  });

  it('opens popup when trigger is clicked', () => {
    const handleChange = jest.fn();
    render(
      <MonthPicker
        value={testMonth}
        onChange={handleChange}
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes popup on escape key', () => {
    const handleChange = jest.fn();
    render(
      <MonthPicker
        value={testMonth}
        onChange={handleChange}
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
