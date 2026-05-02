import React from 'react';
import Link from 'next/link';

const exploreLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#support', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#care', label: 'Care' },
] as const;

const companyLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' },
] as const;

const currentYear = new Date().getFullYear();

const LandingCompanyFooter = React.memo(function LandingCompanyFooter() {
  return (
    <footer className="px-6 pb-12 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">
              Serene
            </p>
            <p className="mt-3 max-w-md text-base leading-7 text-calm-muted">
              A calm space for daily reflection — built to support people living with bipolar disorder
              and other emotional health challenges through gentle, AI-assisted journaling.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-calm-text">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map((exploreLink) => (
                <li key={exploreLink.href}>
                  <Link
                    href={exploreLink.href}
                    className="text-sm text-calm-muted transition hover:text-calm-text"
                  >
                    {exploreLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-calm-text">
              Company
            </p>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((companyLink) => (
                <li key={companyLink.href}>
                  <Link
                    href={companyLink.href}
                    className="text-sm text-calm-muted transition hover:text-calm-text"
                  >
                    {companyLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-calm-muted">
            © {currentYear} Serene. All rights reserved.
          </p>
          <p className="text-xs text-calm-muted">
            Serene is not a medical device or substitute for professional mental health care.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default LandingCompanyFooter;
