import React from 'react';

import LandingWhySereneCardItem from './LandingWhySereneCardItem';

const supportPillars = [
  {
    icon: 'user',
    title: 'Privacy',
    textBefore: 'Built for ',
    accent: 'bipolar disorder',
    textAfter: ' and other emotional health challenges.',
    parallaxRangePixels: 80,
  },
  {
    icon: 'lock',
    title: 'Gentle Support',
    textBefore: '',
    accent: 'Gentle support',
    textAfter: ' without clinical diagnoses or judgment.',
    parallaxRangePixels: 180,
  },
  {
    icon: 'check',
    title: 'Track Your State',
    textBefore: 'A strong base for ',
    accent: 'daily reflection',
    textAfter: ' and future mood insights.',
    parallaxRangePixels: 280,
  },
] as const;

const LandingWhySereneCard = React.memo(function LandingWhySereneCard() {
  return (
    <section className="rounded-[32px] p-7 sm:p-8">
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-calm-text">WHY MENTAL HEALTH</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {supportPillars.map((supportPillar) => (
          <LandingWhySereneCardItem
            key={supportPillar.accent}
            icon={supportPillar.icon}
            title={supportPillar.title}
            textBefore={supportPillar.textBefore}
            accent={supportPillar.accent}
            textAfter={supportPillar.textAfter}
            parallaxRangePixels={supportPillar.parallaxRangePixels}
          />
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
