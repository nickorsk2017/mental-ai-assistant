'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Icon } from '@common/shared/ui-kit';

import { patientAdminNavigationItems } from './PatientAdminNavigationItems';

interface PatientAdminMobileHeaderProps {
  userEmail: string;
  userDisplayName: string;
  onSignOut: () => void;
  isSigningOut: boolean;
}

export default function PatientAdminMobileHeader({
  userEmail,
  userDisplayName,
  onSignOut,
  isSigningOut,
}: PatientAdminMobileHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeMenu = () => setIsMenuOpen(false);

    window.addEventListener('resize', closeMenu);

    return () => window.removeEventListener('resize', closeMenu);
  }, [isMenuOpen]);

  return (
    <header className="relative z-30 lg:hidden">
      <div className="rounded-[28px] border border-calm-border/70 bg-calm-surface/65 px-5 py-3 shadow-subtle backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">Serene</p>
            <p className="mt-1 text-sm text-calm-muted">Patient panel</p>
          </Link>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-calm-second bg-calm-second/10 text-calm-second transition hover:bg-calm-second/15"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 rounded-[24px] border border-calm-border/70 bg-white/90 p-4 shadow-soft">
            <nav aria-label="Patient navigation" className="flex flex-col gap-2">
              {patientAdminNavigationItems.map((navigationItem) => {
                const isActive = pathname === navigationItem.href;

                return (
                  <Link
                    key={navigationItem.href}
                    href={navigationItem.href}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-calm-second/18 text-calm-text' : 'text-calm-muted hover:bg-calm-background'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {navigationItem.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 rounded-2xl border border-calm-border/55 bg-calm-surface/70 px-3 py-3">
              <div className="flex items-start gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-calm-second/12 text-calm-second">
                  <Icon name="user" size={18} color="currentColor" />
                </span>
                <div className="min-w-0 flex-1">
                  {userDisplayName && <p className="truncate text-sm font-semibold text-calm-text">{userDisplayName}</p>}
                  <p className="truncate text-xs text-calm-muted">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full"
                isLoading={isSigningOut}
                onClick={onSignOut}
              >
                Log out
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
