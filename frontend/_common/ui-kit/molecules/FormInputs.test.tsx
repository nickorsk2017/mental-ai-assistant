import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import MoodScoreSlider from './MoodScoreSlider/MoodScoreSlider';
import Select from './Select/Select';
import TextArea from './TextArea/TextArea';

describe('Form input molecules', () => {
  it('updates textarea content through onChange', () => {
    const onChange = jest.fn();
    render(<TextArea value="" onChange={onChange} label="Summary" />);

    fireEvent.change(screen.getByLabelText('Summary'), {
      target: { value: 'Updated text' },
    });

    expect(onChange).toHaveBeenCalledWith('Updated text');
  });

  it('changes mood score when the range input moves', () => {
    const onChange = jest.fn();
    render(<MoodScoreSlider value={5} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Mood score'), {
      target: { value: '8' },
    });

    expect(onChange).toHaveBeenCalledWith(8);
  });

  it('opens select options and emits the chosen value', () => {
    const onChange = jest.fn();
    render(
      <Select
        value=""
        onChange={onChange}
        label="Tags"
        options={[
          { label: 'Work', value: 'work' },
          { label: 'Sleep', value: 'sleep' },
        ]}
      />,
    );

    fireEvent.click(screen.getByLabelText('Tags'));
    fireEvent.click(screen.getByRole('option', { name: 'Sleep' }));

    expect(onChange).toHaveBeenCalledWith('sleep');
  });
});
