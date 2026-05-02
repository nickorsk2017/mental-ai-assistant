import React from 'react';

const LandingPricingCard = React.memo(function LandingPricingCard() {
  return (
    <section className="rounded-[32px] border border-calm-border bg-white p-7 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-calm-primary">Pricing</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight text-calm-text">How much does it cost?</h2>
      <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-calm-text">
        It is free for early customers!
      </p>
      <p className="mt-3 max-w-2xl text-base leading-7 text-calm-muted">
        Start early, shape the product with us, and get access before public pricing appears.
      </p>
    </section>
  );
});

export default LandingPricingCard;
