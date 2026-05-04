import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import Select from './Select';

describe('Select', () => {
  const mockOptions = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ];

  it('renders trigger button with placeholder', () => {
    const handleChange = jest.fn();
    render(
      <Select
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select an option"
      />
    );
    expect(screen.getByRole('button')).toHaveTextContent('Select an option');
  });

  it('opens dropdown when trigger is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Select
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select"
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onChange when an option is selected', () => {
    const handleChange = jest.fn();
    render(
      <Select
        value=""
        onChange={handleChange}
        options={mockOptions}
        placeholder="Select"
      />
    );
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalledWith('opt1');
  });
});
