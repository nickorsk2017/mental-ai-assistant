'use client';

import React from 'react';

interface PlaceholderProps {
  sectionHeading: string;
  sectionDescription: string;
}

const Placeholder = React.memo(function Placeholder({ sectionHeading, sectionDescription }: PlaceholderProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-background">
      <header className="shrink-0 border-b border-calm-border/45 px-6 py-4 backdrop-blur-sm">
        <h1 className="text-base font-semibold text-calm-text">{sectionHeading}</h1>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-md rounded-[28px] border border-calm-border/50 bg-calm-surface/60 px-8 py-10 text-center shadow-subtle backdrop-blur-sm">
          <p className="text-sm leading-7 text-calm-muted">{sectionDescription}</p>
        </div>
      </div>
    </div>
  );
});

export default Placeholder;
