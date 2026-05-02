'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@common/shared/ui-kit';

const navigationItems = [
  { href: '#hero', label: 'Home' },
  { href: '#support', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#care', label: 'Care' },
] as const;

const Header = React.memo(function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 16);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', closeMenu);

    return () => {
      window.removeEventListener('resize', closeMenu);
    };
  }, [isMenuOpen]);

  const headerClassName = useMemo(() => (
    hasScrolled
      ? 'border-calm-border/80 shadow-medium backdrop-blur-xl'
      : 'border-calm-border/60 shadow-subtle backdrop-blur'
  ), [hasScrolled]);

  return (
    <div className="sticky top-4 z-30 px-4 sm:px-0">
      <div className={`mx-auto max-w-7xl rounded-[28px] border px-5 py-3 transition-all duration-300 ${headerClassName}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-primary">Serene</p>
            <p className="text-sm text-calm-muted">AI-powered mental wellness journal</p>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {navigationItems.map((navigationItem) => (
              <Link
                key={navigationItem.href}
                href={navigationItem.href}
                className="text-sm font-medium text-calm-muted transition hover:text-calm-text"
              >
                {navigationItem.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              rounded
              wide={false}
              className="flex h-12 min-h-0 w-12 items-center justify-center border-calm-primary bg-calm-primary/10 p-0 text-calm-primary hover:bg-calm-primary/15 lg:hidden"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 rounded-full bg-current transition ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </span>
            </Button>
            <Link
              href="/auth"
              className="hidden rounded-full border border-calm-primary bg-calm-primary px-5 py-3 text-sm font-semibold text-calm-primary-text transition hover:brightness-95 sm:inline-flex"
            >
              Try for free
            </Link>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 rounded-[24px] border border-calm-border bg-white/90 p-4 shadow-soft lg:hidden">
            <nav className="flex flex-col gap-3">
              {navigationItems.map((navigationItem) => (
                <Link
                  key={navigationItem.href}
                  href={navigationItem.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-calm-text transition hover:bg-calm-background"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navigationItem.label}
                </Link>
              ))}
              <Link
                href="/auth"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-calm-primary bg-calm-primary px-5 py-3 text-sm font-semibold text-calm-primary-text transition hover:brightness-95 sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                Try for free
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
});

export default Header;
