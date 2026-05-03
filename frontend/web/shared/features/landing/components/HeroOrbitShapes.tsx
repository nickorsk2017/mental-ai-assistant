import React from 'react';

const decorativeShapes = [
  {
    className:
      'absolute -left-16 top-4 h-20 w-20 rounded-full border border-calm-border bg-calm-surface/80 shadow-soft animate-gentle-float',
  },
  {
    className:
      'absolute -right-12 top-14 h-14 w-14 rotate-12 rounded-[18px] border border-calm-border bg-calm-second/15 shadow-subtle animate-slow-spin',
  },
  {
    className:
      'absolute -left-1 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full border-2 border-dashed border-calm-second/45 bg-transparent animate-gentle-pulse',
  },
  {
    className:
      'absolute -right-18 bottom-18 h-0 w-0 border-x-[24px] border-b-[40px] border-x-transparent border-b-calm-second/20 animate-gentle-drift',
  },
  {
    className:
      'absolute left-1/2 -top-4 h-18 w-18 -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-calm-border bg-white/70 shadow-subtle animate-gentle-float-delayed',
  },
  {
    className:
      'absolute right-10 -bottom-2 h-24 w-24 rounded-full border border-calm-border bg-[radial-gradient(circle,_rgba(124,156,245,0.2),_rgba(255,255,255,0.08))] blur-[1px] animate-gentle-pulse',
  },
] as const;

const HeroOrbitShapes = React.memo(function HeroOrbitShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -inset-14 hidden lg:block">
      {decorativeShapes.map((decorativeShape) => (
        <span key={decorativeShape.className} className={decorativeShape.className} />
      ))}
    </div>
  );
});

export default HeroOrbitShapes;
