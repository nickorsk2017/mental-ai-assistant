'use client';

import React, { useCallback } from 'react';
import { useAuthentication } from '../../hooks';
import { useAuthenticationStore } from '../../stores/useAuthStore';

interface DashboardOrganismProps {
  onSignedOut?: () => void;
}

export const DashboardOrganism = React.memo(function DashboardOrganism({ onSignedOut }: DashboardOrganismProps) {
  const currentUser = useAuthenticationStore((state) => state.currentUser);
  const { logout, isAuthenticating } = useAuthentication();

  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();
    if (didSignOut) onSignedOut?.();
  }, [logout, onSignedOut]);

  return (
    <div className="min-h-screen bg-calm-background flex items-center justify-center p-4">
      <div className="bg-calm-surface rounded-3xl w-full max-w-[420px] p-8 text-center">
        <h1 className="text-3xl font-bold text-calm-text mb-2">Hello, World!</h1>
        <p className="text-base text-calm-primary">{currentUser?.email ?? 'Unknown user'}</p>
        {currentUser?.displayName ? <p className="text-sm text-calm-muted mt-2">{currentUser.displayName}</p> : null}
        <button className="mt-6 border border-calm-border rounded-xl px-4 py-3 w-full" onClick={() => void handleSignOut()}>
          {isAuthenticating ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
});
