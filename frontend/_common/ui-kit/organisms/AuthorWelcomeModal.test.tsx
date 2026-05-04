import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import AuthorWelcomeModal from './AuthorWelcomeModal';

describe('AuthorWelcomeModal', () => {
  const mockUserId = 'test-user-123';
  const storageKey = `mental-health-author-welcome:${mockUserId}`;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders modal when user has not seen it before', () => {
    render(<AuthorWelcomeModal userId={mockUserId} />);

    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeTruthy();
    expect(screen.getByText('Author: Nikolai Stepanov')).toBeTruthy();
  });

  it('does not render modal when userId is null', () => {
    render(<AuthorWelcomeModal userId={null} />);

    expect(screen.queryByRole('heading', { name: 'Welcome' })).toBeNull();
  });

  it('closes modal and stores seen status when Continue button clicked', () => {
    render(<AuthorWelcomeModal userId={mockUserId} />);

    expect(screen.getByText('Author: Nikolai Stepanov')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(localStorage.getItem(storageKey)).toBe('seen');
  });
});
