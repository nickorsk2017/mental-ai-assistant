import { useCallback, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from '@common/shared/services';
import { useAuthenticationStore } from '@common/shared/stores/useAuthStore';

export function useAuthentication() {
  const setCurrentUser = useAuthenticationStore((state) => state.setCurrentUser);
  const clearCurrentUser = useAuthenticationStore((state) => state.clearCurrentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationError, setAuthenticationError] = useState<string | null>(null);

  const clearAuthenticationError = useCallback(() => {
    setAuthenticationError(null);
  }, []);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsAuthenticating(true);
      setAuthenticationError(null);
      try {
        const authenticationResponse = await signInWithEmailAndPassword(email, password);
        if (!authenticationResponse.success) {
          setAuthenticationError(authenticationResponse.error ?? 'Unable to sign in.');
          return;
        }

        const responseData = authenticationResponse.data as { user?: Entity.User } | null;
        setCurrentUser(responseData?.user ?? null);
      } catch (error) {
        setAuthenticationError(error instanceof Error ? error.message : 'Unable to sign in.');
      } finally {
        setIsAuthenticating(false);
      }
    },
    [setCurrentUser],
  );

  const logout = useCallback(async (): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthenticationError(null);
    try {
      const authenticationResponse = await signOut();
      if (!authenticationResponse.success) {
        setAuthenticationError(authenticationResponse.error ?? 'Unable to sign out.');
        return false;
      }
      clearCurrentUser();
      return true;
    } catch (error) {
      setAuthenticationError(error instanceof Error ? error.message : 'Unable to sign out.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [clearCurrentUser]);

  return {
    login,
    logout,
    isAuthenticating,
    authenticationError,
    clearAuthenticationError,
  };
}
