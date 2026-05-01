import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuthSignUpFields } from './AuthSignUpFields';

const signUpWithEmailAndPasswordMock: jest.Mock = jest.fn(async () => ({
  success: true,
  data: { userId: 'fresh-user-one' },
  error: null,
}));

jest.mock('@common/shared/services', () => ({
  signUpWithEmailAndPassword: (...incomingArguments: unknown[]) =>
    signUpWithEmailAndPasswordMock(...incomingArguments),
}));

describe('AuthSignUpFields', () => {
  beforeEach(() => {
    signUpWithEmailAndPasswordMock.mockReset();
    signUpWithEmailAndPasswordMock.mockImplementation(async () => ({
      success: true,
      data: { userId: 'fresh-user-one' },
      error: null,
    }));
  });

  it('flags confirm password mismatch after submit interaction', async () => {
    render(<AuthSignUpFields />);

    fireEvent.change(screen.getByPlaceholderText('Display name'), { target: { value: 'New Person' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'new.person@example.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'matching-one' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'other-one' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(await screen.findByText('Passwords must match.')).toBeTruthy();
    expect(signUpWithEmailAndPasswordMock).not.toHaveBeenCalled();
  });

  it('delegates signup to backend service then invokes callback hook', async () => {
    const onSignedUpCallback = jest.fn();
    render(<AuthSignUpFields onSignedUp={onSignedUpCallback} />);

    fireEvent.change(screen.getByPlaceholderText('Display name'), { target: { value: 'New Person' } });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'new.person@example.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'matching-one' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'matching-one' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(signUpWithEmailAndPasswordMock).toHaveBeenCalledTimes(1);
    });
    expect(signUpWithEmailAndPasswordMock).toHaveBeenCalledWith(
      'new.person@example.test',
      'matching-one',
      'New Person',
    );
    await waitFor(() => {
      expect(onSignedUpCallback).toHaveBeenCalledTimes(1);
    });
  });
});
