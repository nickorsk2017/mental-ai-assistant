import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { useAuthentication } from './useAuth';

const signInWithEmailAndPasswordMock: jest.Mock = jest.fn();
const signOutMock: jest.Mock = jest.fn();
const setCurrentUserMock: jest.Mock = jest.fn();
const clearCurrentUserMock: jest.Mock = jest.fn();

jest.mock('@common/shared/services', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => signInWithEmailAndPasswordMock(...args),
  signOut: () => signOutMock(),
}));

jest.mock('@common/shared/stores/useAuthStore', () => ({
  useAuthenticationStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      setCurrentUser: setCurrentUserMock,
      clearCurrentUser: clearCurrentUserMock,
    }),
}));

describe('useAuthentication', () => {
  beforeEach(() => {
    signInWithEmailAndPasswordMock.mockReset();
    signOutMock.mockReset();
    setCurrentUserMock.mockReset();
    clearCurrentUserMock.mockReset();
  });

  it('stores authenticated user after successful login', async () => {
    signInWithEmailAndPasswordMock.mockImplementation(async () => ({
      success: true,
      data: { user: { id: 'u1', email: 'mail@test.com' } },
      error: null,
    }));

    const { result } = renderHook(() => useAuthentication());

    await act(async () => {
      await result.current.login({ email: 'mail@test.com', password: 'secret' });
    });

    expect(setCurrentUserMock).toHaveBeenCalledWith({ id: 'u1', email: 'mail@test.com' });
    expect(result.current.authenticationError).toBeNull();
  });

  it('clears user and returns true on successful logout', async () => {
    signOutMock.mockImplementation(async () => ({ success: true, data: null, error: null }));

    const { result } = renderHook(() => useAuthentication());

    let didSignOut = false;
    await act(async () => {
      didSignOut = await result.current.logout();
    });

    expect(didSignOut).toBe(true);
    expect(clearCurrentUserMock).toHaveBeenCalledTimes(1);
  });
});
