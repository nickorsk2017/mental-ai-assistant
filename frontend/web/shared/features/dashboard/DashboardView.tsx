'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@common/shared/hooks';
import { Button, Icon } from '@common/shared/ui-kit';
import type { ServerUser } from '../../lib/getServerUser';

interface DashboardViewProps {
  user: ServerUser;
}

export const DashboardView = React.memo(function DashboardView({ user }: DashboardViewProps) {
  const currentUser = user;
  const router = useRouter();

  const { logout, isAuthenticating } = useAuthentication();
  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();

    if (didSignOut) {
      router.push('/auth');
    }
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-calm-background flex items-center justify-center p-4">
      <div className="bg-calm-surface rounded-3xl shadow-lifted w-full max-w-[420px] p-8 text-center">
        <Icon name="check" size={56} color="currentColor" className="text-calm-success mx-auto" />
        <h1 className="text-3xl font-bold text-calm-text mt-4 mb-2">Hello, World!</h1>
        <p className="text-medium font-medium text-calm-primary mb-2">{currentUser.email}</p>
        {currentUser.displayName && (
          <p className="text-body text-calm-muted mb-6">{currentUser.displayName}</p>
        )}
        <div className="mt-6">
          <Button onClick={handleSignOut} variant="outline" isLoading={isAuthenticating}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
});
