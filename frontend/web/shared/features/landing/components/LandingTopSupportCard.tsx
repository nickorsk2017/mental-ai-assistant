import React from 'react';

import LandingDoctorSupportCard from './LandingDoctorSupportCard';
import LandingHowItWorksCard from './LandingHowItWorksCard';

const LandingTopSupportCard = React.memo(function LandingTopSupportCard() {
  return (
    <section className="rounded-[32px] border border-calm-border bg-[linear-gradient(135deg,rgba(124,156,245,0.1),rgba(255,255,255,0.92))] p-7 shadow-soft sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <LandingHowItWorksCard />
        <LandingDoctorSupportCard />
      </div>
    </section>
  );
});

export default LandingTopSupportCard;
