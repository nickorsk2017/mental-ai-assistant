'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const Header = React.memo(function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

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

  const headerClassName = useMemo(() => (
    hasScrolled
      ? 'border-calm-border/80 bg-calm-surface/72 shadow-medium backdrop-blur-xl'
      : 'border-calm-border/60 bg-calm-surface/50 shadow-subtle backdrop-blur'
  ), [hasScrolled]);

  return (
    <div className="sticky top-4 z-30">
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border px-5 py-3 transition-all duration-300 ${headerClassName}`}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-primary">Serene</p>
          <p className="text-sm text-calm-muted">AI-powered mental wellness journal</p>
        </div>
        <Link
          href="/auth"
          className="rounded-full border border-calm-primary bg-calm-primary px-5 py-3 text-sm font-semibold text-calm-primary-text transition hover:brightness-95"
        >
          Try for free
        </Link>
      </div>
    </div>
  );
});

export default Header;
