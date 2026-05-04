import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('renders with value', () => {
    render(
      <TextArea
        value="Hello world"
        onChange={() => {}}
      />
    );
    expect(screen.getByDisplayValue('Hello world')).toBeInTheDocument();
  });

  it('calls onChange when text is typed', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <TextArea
        value=""
        onChange={handleChange}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new text' } });
    expect(handleChange).toHaveBeenCalledWith('new text');
  });

  it('displays errorMessage when provided', () => {
    render(
      <TextArea
        value=""
        onChange={() => {}}
        errorMessage="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <TextArea
        value=""
        onChange={() => {}}
        label="Description"
      />
    );
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });
});
