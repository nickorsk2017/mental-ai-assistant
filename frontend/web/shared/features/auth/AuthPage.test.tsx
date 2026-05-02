import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

interface AuthenticationStoreSnapshot {
  currentUser: { id: string } | null;
}

const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

jest.mock('@common/shared/ui-kit', () => ({
  AuthForm: () => <div data-testid="auth-form">Auth Form</div>,
}));

const useAuthenticationStoreMock = jest.fn(
  (selector: (state: AuthenticationStoreSnapshot) => unknown) =>
    selector({ currentUser: null }),
);

jest.mock('@common/shared/stores/useAuthStore', () => ({
  useAuthenticationStore: (selector: (state: AuthenticationStoreSnapshot) => unknown) =>
    useAuthenticationStoreMock(selector),
}));

const AuthPage = require('./AuthPage').default as typeof import('./AuthPage').default;

describe('AuthPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    useAuthenticationStoreMock.mockReset();
  });

  it('renders auth form when user is not authenticated', () => {
    useAuthenticationStoreMock.mockImplementation(
      (selector: (state: AuthenticationStoreSnapshot) => unknown) =>
        selector({ currentUser: null }),
    );

    render(<AuthPage />);

    expect(screen.getByTestId('auth-form')).toBeTruthy();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects to dashboard when user exists', () => {
    useAuthenticationStoreMock.mockImplementation(
      (selector: (state: AuthenticationStoreSnapshot) => unknown) =>
        selector({ currentUser: { id: '1' } }),
    );

    const { container } = render(<AuthPage />);

    expect(container.firstChild).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith('/dashboard/chat');
  });
});
