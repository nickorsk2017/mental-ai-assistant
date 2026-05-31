import React from 'react';

import { Icon } from '../../../../../_common/ui-kit';
import { useParallaxRise } from '../hooks/useParallaxRise';

type SupportIconName = 'user' | 'lock' | 'check';

interface LandingWhyAssistantCardItemProps {
  icon: SupportIconName;
  title: string;
  textBefore: string;
  accent: string;
  textAfter: string;
  parallaxRangePixels: number;
}

const iconContainerClassNameMap: Record<SupportIconName, string> = {
  user: 'border-sky-100 bg-sky-50 text-sky-400',
  lock: 'border-rose-100 bg-rose-50 text-rose-400',
  check: 'border-violet-100 bg-violet-50 text-violet-400',
};

const iconStrokeColorMap: Record<SupportIconName, string> = {
  user: '#60a5fa',
  lock: '#fb7185',
  check: '#a78bfa',
};

const LandingWhyAssistantCardItem = React.memo(function LandingWhyAssistantCardItem({
  icon,
  title,
  textBefore,
  accent,
  textAfter,
  parallaxRangePixels,
}: LandingWhyAssistantCardItemProps) {
  const articleElementRef = useParallaxRise<HTMLElement>(
    parallaxRangePixels,
    '(min-width: 768px)'
  );

  return (
    <article
      ref={articleElementRef}
      className="rounded-[24px] border border-calm-border bg-calm-surface/96 p-6 shadow-subtle will-change-transform"
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${iconContainerClassNameMap[icon]}`}
        >
          <Icon name={icon} size={26} color={iconStrokeColorMap[icon]} />
        </div>
        <p className="pt-1 text-right text-sm font-semibold uppercase tracking-[0.16em] text-calm-muted">
          {title}
        </p>
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-1.5 w-16 rounded-full bg-calm-primary/35" />
        <div className="h-1.5 w-24 rounded-full bg-calm-primary/22" />
      </div>
      <p className="mt-5 text-base font-semibold leading-7 text-calm-text">
        {textBefore}
        <span>{accent}</span>
        {textAfter}
      </p>
    </article>
  );
});

export default LandingWhyAssistantCardItem;
