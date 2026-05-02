import React from 'react';
import Link from 'next/link';

const LandingHeroContent = React.memo(function LandingHeroContent() {
  return (
    <div className="max-w-2xl">
      <h1 className="mt-6 max-w-xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
        Notice your emotional state earlier.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8">
        People living with bipolar disorder and other mental health challenges are often left alone with
        overwhelm, anxiety, and abrupt mood shifts. 
        <br/>
        <br/>
        Serene gives them a private space to write naturally,
        while an AI agent turns those messages into structured notes and gentle support.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/auth"
          className="inline-flex items-center justify-center rounded-full border border-calm-primary bg-calm-primary px-6 py-4 text-base font-semibold text-calm-primary-text shadow-medium transition hover:-translate-y-0.5 hover:brightness-95"
        >
          Try for free
        </Link>
      </div>
    </div>
  );
});

export default LandingHeroContent;
