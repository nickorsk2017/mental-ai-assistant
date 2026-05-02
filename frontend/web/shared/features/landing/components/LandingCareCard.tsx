import React from 'react';
import Image from 'next/image';

import careBear from '../images/CareBear.png';

const LandingCareCard = React.memo(function LandingCareCard() {
  return (
    <section className="relative rounded-[36px] border border-calm-border bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,255,0.92)_48%,rgba(255,246,238,0.94))] p-10 shadow-soft sm:p-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-calm-second">Care</p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-calm-text sm:text-5xl">
          We care about you
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-calm-muted">
          Serene is designed to feel calm, private, and supportive so people can return to their thoughts,
          emotions, and patterns with more confidence and less pressure.
        </p>
      </div>
      <div className="pointer-events-none absolute -bottom-10 right-0 hidden w-[34%] min-w-[260px] lg:block">
        <Image src={careBear} alt="Orange teddy bear" className="h-auto w-full object-contain" priority />
      </div>
    </section>
  );
});

export default LandingCareCard;
