import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import { AuthForm } from './AuthForm';

jest.mock('./components/AuthSignInFields', () => ({
  AuthSignInFields: function MockAuthSignInFields() {
    return <div data-testid="mock-auth-sign-in-fields">sign-in</div>;
  },
}));

jest.mock('./components/AuthSignUpFields', () => ({
  AuthSignUpFields: function MockAuthSignUpFields() {
    return <div data-testid="mock-auth-sign-up-fields">sign-up</div>;
  },
}));

describe('AuthForm', () => {
  it('starts in sign-in mode and shows SIGN IN headline', () => {
    render(<AuthForm />);

    expect(screen.getByRole('heading', { level: 1, name: 'SIGN IN' })).toBeTruthy();
    expect(screen.getByTestId('mock-auth-sign-in-fields')).toBeTruthy();
  });

  it('switches headline and pane when activating sign up navigation', () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(screen.getByRole('heading', { level: 1, name: 'SIGN UP' })).toBeTruthy();
    expect(screen.queryByTestId('mock-auth-sign-in-fields')).toBeNull();
    expect(screen.getByTestId('mock-auth-sign-up-fields')).toBeTruthy();
  });

  it('returns to sign-in panel when Sign In tab pressed from sign-up', () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByRole('heading', { level: 1, name: 'SIGN IN' })).toBeTruthy();
    expect(screen.getByTestId('mock-auth-sign-in-fields')).toBeTruthy();
  });
});
