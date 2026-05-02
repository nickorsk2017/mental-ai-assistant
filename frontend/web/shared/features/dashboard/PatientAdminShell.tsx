'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@common/shared/hooks';

import type { ServerUser } from '../../lib/getServerUser';
import PatientAdminSidebar from './components/PatientAdminSidebar';

interface PatientAdminShellProps {
  user: ServerUser;
  children: React.ReactNode;
}

const PatientAdminShell = React.memo(function PatientAdminShell({
  user,
  children,
}: PatientAdminShellProps) {
  const router = useRouter();
  const { logout, isAuthenticating } = useAuthentication();

  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();

    if (didSignOut) {
      router.push('/auth');
    }
  }, [logout, router]);

  return (
    <div className="flex min-h-screen gap-4 bg-calm-background p-4">
      <PatientAdminSidebar
        userEmail={user.email}
        userDisplayName={user.displayName}
        onSignOut={handleSignOut}
        isSigningOut={isAuthenticating}
      />
      <main className="flex min-h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-calm-border/50 bg-calm-surface/40 shadow-subtle backdrop-blur-md">
        {children}
      </main>
    </div>
  );
});

export default PatientAdminShell;
