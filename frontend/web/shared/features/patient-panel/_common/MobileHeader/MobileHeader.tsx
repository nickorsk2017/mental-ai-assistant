'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Icon } from '@common/shared/ui-kit';
import { useAuthentication } from '@common/shared/hooks';

import { patientPanelNavigationLinkActiveClassName } from '../NavigationActiveClassName';
import { patientAdminNavigationItems } from '../constants';
import { ServerUser } from '@/shared/lib/getServerUser';

export default function MobileHeader({ user }: { user: ServerUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isAuthenticating } = useAuthentication();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    const didSignOut = await logout();

    if (didSignOut) {
      router.push('/auth');
    }
  }, [logout, router]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeMenu = () => setIsMenuOpen(false);

    window.addEventListener('resize', closeMenu);

    return () => window.removeEventListener('resize', closeMenu);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className="relative z-40 lg:hidden">
      <div className="rounded-[28px] border border-calm-border/70 bg-calm-surface/65 px-5 py-3 shadow-subtle backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-primary">Serene</p>
            <p className="mt-1 text-sm text-calm-muted">Patient panel</p>
          </Link>
          <Button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            rounded
            wide={false}
            variant="ghost"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-calm-background/22 backdrop-blur-sm">
          <div className="flex h-full flex-col p-3">
            <div className="flex h-full flex-col rounded-[28px] border border-calm-border/80 bg-calm-surface/56 px-5 py-3 shadow-medium backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-primary">Serene</p>
                  <p className="mt-1 text-sm text-calm-muted">Patient panel</p>
                </Link>
                <Button
                  type="button"
                  aria-label="Close navigation menu"
                  rounded
                  wide={false}
                  variant="ghost"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="relative block h-4 w-4">
                    <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                    <span className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                  </span>
                </Button>
              </div>
              <nav aria-label="Patient navigation" className="mt-5 flex flex-1 flex-col gap-2">
                {patientAdminNavigationItems.map((navigationItem) => {
                  const [navigationHref, navigationLabel] = navigationItem;
                  const isActive = pathname === navigationHref;

                  return (
                    <Link
                      key={navigationHref}
                      href={navigationHref}
                      className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? patientPanelNavigationLinkActiveClassName
                          : 'text-calm-muted hover:bg-calm-background/70'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {navigationLabel}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto rounded-2xl border border-calm-border/55 bg-calm-surface/70 px-3 py-3">
                <div className="flex items-start gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-calm-primary/12 text-calm-primary">
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
