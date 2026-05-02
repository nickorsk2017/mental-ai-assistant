'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Icon } from '@common/shared/ui-kit';

import { patientAdminNavigationItems } from './PatientAdminNavigationItems';

interface PatientAdminSidebarProps {
  userEmail: string;
  userDisplayName: string;
  onSignOut: () => void;
  isSigningOut: boolean;
}

const PatientAdminSidebar = React.memo(function PatientAdminSidebar({
  userEmail,
  userDisplayName,
  onSignOut,
  isSigningOut,
}: PatientAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden h-[calc(100vh-2rem)] w-[272px] shrink-0 flex-col rounded-[28px] border border-calm-border/75 bg-[#eef3fd] px-4 py-6 shadow-subtle backdrop-blur-xl lg:flex">
      <Link href="/" className="mb-8 block px-1">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">Serene</p>
        <p className="mt-1 text-xs text-calm-muted">Patient panel</p>
      </Link>

      <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-1">
        {patientAdminNavigationItems.map((navigationItem) => {
          const isActive = pathname === navigationItem.href;

          return (
            <Link
              key={navigationItem.href}
              href={navigationItem.href}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-calm-second/18 text-calm-text shadow-subtle'
                  : 'text-calm-muted hover:bg-calm-surface/70 hover:text-calm-text'
              }`}
            >
              {navigationItem.label}
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
            {userDisplayName && (
              <p className="truncate text-sm font-semibold text-calm-text">{userDisplayName}</p>
            )}
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
    </aside>
  );
});

export default PatientAdminSidebar;
