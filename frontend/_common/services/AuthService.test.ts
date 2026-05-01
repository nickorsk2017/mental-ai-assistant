import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const requestBackendMock: jest.Mock = jest.fn();

jest.mock('@common/shared/utils', () => ({
  requestBackend: (...incomingArguments: unknown[]) => requestBackendMock(...incomingArguments),
}));

const backendUserRow = {
  id: 'user-uuid-one',
  email: 'human@site.com',
  displayName: 'Human',
  createdAt: '2024-06-01T12:00:00.000Z',
};

const backendAuthenticationSuccessPayload = {
  accessToken: 'access-token-sample',
  refreshToken: 'refresh-token-sample',
  expiresAt: Math.floor(Date.now() / 1000) + 7200,
  user: backendUserRow,
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.resetModules();
    requestBackendMock.mockReset();
    document.cookie = '';
    delete process.env.NEXT_PUBLIC_RUNTIME_PLATFORM;
  });

  describe('signInWithEmailAndPassword', () => {
    it('maps backend user into Entity shape on web without exposing tokens', async () => {
      requestBackendMock.mockImplementation(async () => ({
        success: true,
        data: { user: backendUserRow },
        error: null,
      }));

      const { signInWithEmailAndPassword } = await import('./AuthService');
      const result = await signInWithEmailAndPassword('human@site.com', 'password-value');

      expect(requestBackendMock).toHaveBeenCalledWith('/auth/sign-in', {
        method: 'POST',
        body: { email: 'human@site.com', password: 'password-value' },
        headers: { 'x-client-platform': 'web' },
      });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(result.data?.user).toEqual({
        ...backendUserRow,
        avatarUrl: null,
        updatedAt: backendUserRow.createdAt,
      });
      expect(result.data?.session).toBeNull();
    });

    it('keeps token session data for mobile clients', async () => {
      process.env.NEXT_PUBLIC_RUNTIME_PLATFORM = 'mobile';
      requestBackendMock.mockImplementation(async () => ({
        success: true,
        data: backendAuthenticationSuccessPayload,
        error: null,
      }));

      const { signInWithEmailAndPassword } = await import('./AuthService');
      const result = await signInWithEmailAndPassword('human@site.com', 'password-value');

      expect(requestBackendMock).toHaveBeenCalledWith('/auth/sign-in', {
        method: 'POST',
        body: { email: 'human@site.com', password: 'password-value' },
        headers: { 'x-client-platform': 'mobile' },
      });
      expect(result.data?.session).toMatchObject({
        accessToken: 'access-token-sample',
        refreshToken: 'refresh-token-sample',
      });
    });

    it('returns error envelope when backend reports failure', async () => {
      requestBackendMock.mockImplementation(async () => ({
        success: false,
        data: null,
        error: 'Invalid credentials.',
      }));

      const { signInWithEmailAndPassword } = await import('./AuthService');
      const result = await signInWithEmailAndPassword('x@y.z', 'bad');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials.');
    });

    it('returns error envelope when requestBackend throws', async () => {
      requestBackendMock.mockImplementation(async () => {
        throw new Error('Network unreachable');
      });

      const { signInWithEmailAndPassword } = await import('./AuthService');
      const result = await signInWithEmailAndPassword('x@y.z', 'p');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network unreachable');
    });
  });

  describe('signUpWithEmailAndPassword', () => {
    it('delegates to requestBackend sign-up endpoint', async () => {
      requestBackendMock.mockImplementation(async () => ({
        success: true,
        data: { userId: 'new-one' },
        error: null,
      }));

      const { signUpWithEmailAndPassword } = await import('./AuthService');
      const result = await signUpWithEmailAndPassword('new@site.com', 'pw', 'New User');

      expect(requestBackendMock).toHaveBeenCalledWith('/auth/sign-up', {
        method: 'POST',
        body: {
          email: 'new@site.com',
          password: 'pw',
          displayName: 'New User',
        },
      });
      expect(result.success).toBe(true);
      expect(result.data?.userId).toBe('new-one');
    });
  });

  describe('signOut', () => {
    it('includes access token from session after sign-in', async () => {
      process.env.NEXT_PUBLIC_RUNTIME_PLATFORM = 'mobile';
      requestBackendMock
        .mockImplementationOnce(async () => ({
          success: true,
          data: backendAuthenticationSuccessPayload,
          error: null,
        }))
        .mockImplementationOnce(async () => ({ success: true, data: null, error: null }));

      const { signInWithEmailAndPassword, signOut } = await import('./AuthService');
      await signInWithEmailAndPassword('human@site.com', 'password-value');
      await signOut();

      expect(requestBackendMock).toHaveBeenLastCalledWith(
        '/auth/sign-out',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          accessToken: 'access-token-sample',
          headers: { 'x-client-platform': 'mobile' },
        }),
      );
    });

    it('calls sign-out without access token when not signed in', async () => {
      requestBackendMock.mockImplementation(async () => ({ success: true, data: null, error: null }));

      const { signOut } = await import('./AuthService');
      await signOut();

      expect(requestBackendMock).toHaveBeenCalledWith('/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-client-platform': 'web' },
      });
    });

    it('preserves backend error envelope', async () => {
      process.env.NEXT_PUBLIC_RUNTIME_PLATFORM = 'mobile';
      requestBackendMock
        .mockImplementationOnce(async () => ({
          success: true,
          data: backendAuthenticationSuccessPayload,
          error: null,
        }))
        .mockImplementationOnce(async () => ({
          success: false,
          data: null,
          error: 'Server rejected.',
        }));

      const { signInWithEmailAndPassword, signOut } = await import('./AuthService');
      await signInWithEmailAndPassword('human@site.com', 'password-value');
      const outcome = await signOut();

      expect(outcome.success).toBe(false);
      expect(outcome.error).toBe('Server rejected.');
    });
  });

  describe('getActiveSession', () => {
    it('returns null data when refresh response has no usable session', async () => {
      requestBackendMock.mockImplementation(async () => ({
        success: false,
        data: null,
        error: null,
      }));

      const { getActiveSession } = await import('./AuthService');
      const result = await getActiveSession();

      expect(result).toEqual({ success: true, data: null, error: null });
    });

    it('returns mapped session when refresh succeeds', async () => {
      process.env.NEXT_PUBLIC_RUNTIME_PLATFORM = 'mobile';
      requestBackendMock.mockImplementation(async () => ({
        success: true,
        data: backendAuthenticationSuccessPayload,
        error: null,
      }));

      const { getActiveSession } = await import('./AuthService');
      const result = await getActiveSession();

      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('human@site.com');
      expect(result.data?.session).not.toBeNull();
      expect(result.data?.session?.refreshToken).toBe('refresh-token-sample');
    });

    it('returns user without session tokens on web refresh', async () => {
      requestBackendMock.mockImplementation(async () => ({
        success: true,
        data: { user: backendUserRow },
        error: null,
      }));

      const { getActiveSession } = await import('./AuthService');
      const result = await getActiveSession();

      expect(requestBackendMock).toHaveBeenCalledWith('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'x-client-platform': 'web' },
      });
      expect(result.success).toBe(true);
      expect(result.data?.user.email).toBe('human@site.com');
      expect(result.data?.session).toBeNull();
    });
  });
});
