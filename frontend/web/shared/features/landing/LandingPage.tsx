'use client';

import React from 'react';

import Header from './components/Header';
import LandingCareCard from './components/LandingCareCard';
import LandingCompanyFooter from './components/LandingCompanyFooter';
import LandingHeroContent from './components/LandingHeroContent';
import LandingPricingCard from './components/LandingPricingCard';
import LandingSupportSection from './components/LandingSupportSection';
import PinkElephantShowcase from './components/PinkElephantShowcase';

const LandingPage = React.memo(function LandingPage() {
  return (
    <main className="relative min-h-screen bg-calm-background">
      <Header />
      <section id="hero" className="isolate scroll-mt-28 px-6 pb-20 pt-4 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[560px]" />

        <div className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[1.42fr_0.58fr] lg:items-center lg:gap-10">
          <LandingHeroContent />
          <PinkElephantShowcase />
        </div>
      </section>

      <section id="support" className="scroll-mt-[212px] px-6 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <LandingSupportSection />
        </div>
      </section>

      <section id="pricing" className="scroll-mt-28 px-6 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <LandingPricingCard />
        </div>
      </section>

      <section id="care" className="scroll-mt-28 px-6 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <LandingCareCard />
        </div>
      </section>

      <LandingCompanyFooter />
    </main>
  );
});

export default LandingPage;
