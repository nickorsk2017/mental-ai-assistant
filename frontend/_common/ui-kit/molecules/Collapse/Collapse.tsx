'use client';

import React, { useId, useState } from 'react';

import { cx } from '../../../utils';

interface CollapseProperties {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default React.memo(function Collapse({
  header,
  children,
  defaultOpen = false,
  className,
}: CollapseProperties) {
  const panelIdentifier = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelIdentifier}
        onClick={() => setIsOpen((previous) => !previous)}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className="sticky top-0 z-10 flex min-h-[42px] w-full cursor-pointer items-center justify-between gap-3 bg-calm-surface px-4 py-[10px] text-left text-body text-calm-text outline-none transition-colors duration-150 focus:outline-none"
      >
        <span className="min-w-0 flex-1 truncate">{header}</span>
        <span
          aria-hidden
          className={cx(
            'inline-flex shrink-0 transition-transform duration-200 ease-out',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        >
          <span className="-mt-0.5 inline-block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-calm-text" />
        </span>
      </button>
      <div
        id={panelIdentifier}
        role="region"
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
});
