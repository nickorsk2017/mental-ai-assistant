'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Icon } from '@common/shared/ui-kit';
import { useAuthentication } from '@common/shared/hooks';

import { patientAdminNavigationItems } from '../constants';
import { ServerUser } from '@/shared/lib/getServerUser';

const Sidebar = React.memo(function Sidebar({ user }: { user: ServerUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticating } = useAuthentication();

  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();

    if (didSignOut) {
      router.push('/auth');
    }
  }, [logout, router]);

  return (
    <aside className="hidden h-[calc(100%-2rem)] w-[272px] shrink-0 flex-col rounded-[28px] border border-calm-border/75 bg-calm-surface/50 px-4 py-6 shadow-subtle backdrop-blur-xl lg:flex">
      <Link href="/" className="mb-8 block px-1">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">Serene</p>
        <p className="mt-1 text-xs text-calm-muted">Patient panel</p>
      </Link>

      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1">
        {patientAdminNavigationItems.map((navigationItem) => {
          const [navigationHref, navigationLabel] = navigationItem;
          const isActive = pathname === navigationHref;

          return (
            <Link
              key={navigationHref}
              href={navigationHref}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-calm-second/18 text-calm-text shadow-subtle'
                  : 'text-calm-muted hover:bg-calm-surface/70 hover:text-calm-text'
              }`}
            >
              {navigationLabel}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-calm-border/55 bg-calm-surface/65 px-3 py-3">
        <div className="flex items-start gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-calm-second/12 text-calm-second">
            <Icon name="user" size={18} color="currentColor" />
          </span>
          <div className="min-w-0 flex-1">
            {user.displayName && (
              <p className="truncate text-sm font-semibold text-calm-text">{user.displayName}</p>
            )}
            <p className="truncate text-xs text-calm-muted">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-3 w-full"
          isLoading={isAuthenticating}
          onClick={() => void handleSignOut()}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
});

export default Sidebar;
