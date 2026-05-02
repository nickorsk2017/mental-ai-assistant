import React from 'react';
import Image from 'next/image';

import doctorPortrait from '../images/DoctorPortrait.png';

const LandingDoctorSupportCard = React.memo(function LandingDoctorSupportCard() {
  return (
    <section className="hidden p-1 lg:block">
      <div className="overflow-hidden rounded-[28px] border border-calm-border bg-calm-surface shadow-subtle">
        <div className="relative aspect-[4/4.9]">
          <Image
            src={doctorPortrait}
            alt="Doctor portrait"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 36vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
});

export default LandingDoctorSupportCard;
