import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('shows default accessibility label content', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('uses custom label when provided', () => {
    render(<LoadingSpinner label="Please wait" />);

    expect(screen.getByText('Please wait')).toBeTruthy();
  });

  it('renders animated spinner skeleton', () => {
    const { container } = render(<LoadingSpinner size="large" themeName="calmDark" />);
    const spinnerElement = container.querySelector('.animate-spin');

    expect(spinnerElement).toBeTruthy();
  });
});
