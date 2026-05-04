import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import DayPicker from './DayPicker';

describe('DayPicker', () => {
  const testDate = '2025-03-15';

  it('renders trigger button with formatted date', () => {
    const handleChange = jest.fn();
    render(
      <DayPicker
        value={testDate}
        onChange={handleChange}
        label="Select a date"
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('opens popup when trigger is clicked', () => {
    const handleChange = jest.fn();
    render(
      <DayPicker
        value={testDate}
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
      <DayPicker
        value={testDate}
        onChange={handleChange}
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
