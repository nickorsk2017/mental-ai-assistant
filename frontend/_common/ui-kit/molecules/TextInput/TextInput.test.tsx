import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('shows label when label prop passed', () => {
    render(
      <TextInput value="" onChange={() => undefined} label="Email address" placeholder="Placeholder" />,
    );

    expect(screen.getByText('Email address')).toBeTruthy();
  });

  it('forwards value changes through onChange', () => {
    const handleChange = jest.fn();
    render(<TextInput value="" onChange={handleChange} placeholder="Type here" />);

    fireEvent.change(screen.getByPlaceholderText('Type here'), { target: { value: 'hello' } });

    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  it('shows error message when validation message provided', () => {
    render(
      <TextInput value="" onChange={() => undefined} placeholder="Field" errorMessage="Wrong format." />,
    );

    expect(screen.getByText('Wrong format.')).toBeTruthy();
  });

  it('toggles password field visibility icon button', () => {
    render(
      <TextInput value="secret-password" onChange={() => undefined} placeholder="Pw" type="password" />,
    );

    const toggleButtonElement = screen.getByRole('button');
    fireEvent.click(toggleButtonElement);

    expect(screen.getByPlaceholderText('Pw').getAttribute('type')).toBe('text');

    fireEvent.click(toggleButtonElement);

    expect(screen.getByPlaceholderText('Pw').getAttribute('type')).toBe('password');
  });
});
