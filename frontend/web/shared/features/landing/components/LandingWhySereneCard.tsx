import React from 'react';

import { Icon } from '../../../../../_common/ui-kit';

const supportPillars = [
  {
    icon: 'user',
    title: 'Privacy',
    textBefore: 'Built for ',
    accent: 'bipolar disorder',
    textAfter: ' and other emotional health challenges.',
  },
  {
    icon: 'lock',
    title: 'Gentle Support',
    textBefore: '',
    accent: 'Gentle support',
    textAfter: ' without clinical diagnoses or judgment.',
  },
  {
    icon: 'check',
    title: 'Track Your State',
    textBefore: 'A strong base for ',
    accent: 'daily reflection',
    textAfter: ' and future mood insights.',
  },
] as const;

function SoftIcon({ icon }: { icon: 'user' | 'lock' | 'check' }) {
  const iconClassName = {
    user: 'border-sky-100 bg-sky-50 text-sky-400',
    lock: 'border-rose-100 bg-rose-50 text-rose-400',
    check: 'border-violet-100 bg-violet-50 text-violet-400',
  }[icon];

  const iconColor = {
    user: '#60a5fa',
    lock: '#fb7185',
    check: '#a78bfa',
  }[icon];

  return (
    <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${iconClassName}`}>
      <Icon name={icon} size={26} color={iconColor} />
    </div>
  );
}

const LandingWhySereneCard = React.memo(function LandingWhySereneCard() {
  return (
    <section className="rounded-[32px] p-7 sm:p-8">
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-calm-text">WHY SERENE</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {supportPillars.map((supportPillar) => (
          <article
            key={supportPillar.accent}
            className="rounded-[24px] border border-calm-border bg-calm-surface/96 p-6 shadow-subtle"
          >
            <div className="flex items-start justify-between gap-4">
              <SoftIcon icon={supportPillar.icon} />
              <p className="pt-1 text-right text-sm font-semibold uppercase tracking-[0.16em] text-calm-muted">
                {supportPillar.title}
              </p>
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-1.5 w-16 rounded-full bg-calm-primary/35" />
              <div className="h-1.5 w-24 rounded-full bg-calm-primary/22" />
            </div>
            <p className="mt-5 text-base font-semibold leading-7 text-calm-text">
              {supportPillar.textBefore}
              <span>{supportPillar.accent}</span>
              {supportPillar.textAfter}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <p className="max-w-xl text-sm leading-6 text-calm-muted">
          Start with authentication, then continue into a private journal and daily AI-supported reflection.
        </p>
      </div>
    </section>
  );
});

export default LandingWhySereneCard;
