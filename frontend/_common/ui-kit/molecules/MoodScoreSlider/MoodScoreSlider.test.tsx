import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import MoodScoreSlider from './MoodScoreSlider';

describe('MoodScoreSlider', () => {
  it('renders with value display', () => {
    render(<MoodScoreSlider value={5} onChange={() => {}} />);
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    const handleChange = jest.fn();
    render(<MoodScoreSlider value={5} onChange={handleChange} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '7' } });
    expect(handleChange).toHaveBeenCalledWith(7);
  });

  it('displays errorMessage when provided', () => {
    render(
      <MoodScoreSlider
        value={5}
        onChange={() => {}}
        errorMessage="Please select a valid mood score"
      />
    );
    expect(screen.getByText('Please select a valid mood score')).toBeInTheDocument();
  });
});
