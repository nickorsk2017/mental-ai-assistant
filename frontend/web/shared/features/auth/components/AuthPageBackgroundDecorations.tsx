'use client';

import React from 'react';

import HeroOrbitShapes from '../../landing/components/HeroOrbitShapes';

const AuthPageBackgroundDecorations = React.memo(function AuthPageBackgroundDecorations() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden lg:block"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(196,236,255,0.28),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(216,214,255,0.26),transparent_20%),radial-gradient(circle_at_65%_72%,rgba(255,210,222,0.22),transparent_26%)]" />
      <div className="absolute right-0 top-14 hidden h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(167,206,255,0.85),_rgba(187,205,255,0.42)_62%,_transparent_78%)] blur-sm xl:block" />
      <div className="absolute right-0 top-1/2 h-[min(72vh,520px)] w-[min(72vh,520px)] max-w-[46vw] -translate-y-1/2 rounded-full border-[10px] border-calm-primary/10" />
      <div className="absolute right-8 top-1/2 h-[min(66vh,470px)] w-[min(66vh,470px)] max-w-[42vw] -translate-y-1/2 rounded-full border-[8px] border-calm-primary/8" />
      <div className="absolute right-14 top-1/2 h-[min(60vh,420px)] w-[min(60vh,420px)] max-w-[38vw] -translate-y-1/2 rounded-full border-[6px] border-calm-primary/6" />

      <div className="absolute right-0 top-24 h-[640px] w-[min(100%,720px)] max-w-[52vw]">
        <div className="relative h-full w-full min-h-[560px]">
          <HeroOrbitShapes />
        </div>
      </div>
    </div>
  );
});

export default AuthPageBackgroundDecorations;
