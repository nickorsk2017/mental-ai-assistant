import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import YearPicker from './YearPicker';

describe('YearPicker', () => {
  it('renders trigger button with year', () => {
    const handleChange = jest.fn();
    render(
      <YearPicker
        value={2025}
        onChange={handleChange}
        label="Select a year"
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Select a year')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('opens popup when trigger is clicked', () => {
    const handleChange = jest.fn();
    render(
      <YearPicker
        value={2025}
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
      <YearPicker
        value={2025}
        onChange={handleChange}
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
