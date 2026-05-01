import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AuthSignInFields } from './AuthSignInFields';

const authenticationLoginMock: jest.Mock = jest.fn(async () => undefined);

jest.mock('@common/shared/hooks', () => ({
  useAuthentication: () => ({
    login: (...incomingArguments: unknown[]) => authenticationLoginMock(...incomingArguments),
    logout: jest.fn(),
    isAuthenticating: false,
    authenticationError: null,
    clearAuthenticationError: jest.fn(),
  }),
}));

describe('AuthSignInFields', () => {
  beforeEach(() => {
    authenticationLoginMock.mockReset();
  });

  it('shows schema validation hints after empty submission', async () => {
    render(<AuthSignInFields />);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Provide a valid email address.')).toBeTruthy();
    expect(screen.getByText('Password must be at least 6 characters.')).toBeTruthy();
  });

  it('invokes authentication login with sanitized form submission', async () => {
    render(<AuthSignInFields />);

    fireEvent.change(screen.getByPlaceholderText('Your e-mail'), {
      target: { value: 'human@sitedomain.test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'proper-length' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(authenticationLoginMock).toHaveBeenCalledTimes(1);
    });
    expect(authenticationLoginMock).toHaveBeenCalledWith({
      email: 'human@sitedomain.test',
      password: 'proper-length',
    });
  });
});
