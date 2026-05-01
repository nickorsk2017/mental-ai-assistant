import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import Button from './Button';

describe('Button', () => {
  it('renders children and calls onClick when enabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={() => handleClick()}>Tap me</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Tap me' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading label and skips click handler while loading', () => {
    const handleClick = jest.fn();
    render(<Button onClick={() => handleClick()} isLoading>Save</Button>);

    const buttonElement = screen.getByRole('button', { name: 'Loading...' });
    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports submit type attribute', () => {
    render(
      <Button type="submit">Send</Button>,
    );

    expect(screen.getByRole('button', { name: 'Send' }).getAttribute('type')).toBe('submit');
  });
});
