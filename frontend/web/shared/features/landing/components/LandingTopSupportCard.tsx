import React, { useEffect, useRef } from 'react';

import LandingDoctorSupportCard from './LandingDoctorSupportCard';
import LandingHowItWorksCard from './LandingHowItWorksCard';

const PARALLAX_RANGE_PIXELS = 300;

const LandingTopSupportCard = React.memo(function LandingTopSupportCard() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) {return;}

    const reducedMotionMediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (reducedMotionMediaQuery.matches) {return;}

    let animationFrameId = 0;
    let elementTopFromPage = 0;

    function captureElementOrigin() {
      const previousTransform = sectionElement!.style.transform;

      sectionElement!.style.transform = '';
      const boundingRect = sectionElement!.getBoundingClientRect();

      elementTopFromPage = boundingRect.top + window.scrollY;
      sectionElement!.style.transform = previousTransform;
    }

    function applyParallaxTransform() {
      const elementHeight = sectionElement!.offsetHeight;
      const viewportHeight = window.innerHeight;
      const elementTopRelativeToViewport = elementTopFromPage - window.scrollY;
      const traveledDistance = viewportHeight - elementTopRelativeToViewport;
      const totalTravel = viewportHeight + elementHeight;
      const rawProgress = traveledDistance / totalTravel;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      const parallaxOffset = -clampedProgress * PARALLAX_RANGE_PIXELS;

      sectionElement!.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    }

    function scheduleParallaxFrame() {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(applyParallaxTransform);
    }

    function handleWindowResize() {
      captureElementOrigin();
      scheduleParallaxFrame();
    }

    captureElementOrigin();
    applyParallaxTransform();
    window.addEventListener('scroll', scheduleParallaxFrame, { passive: true });
    window.addEventListener('resize', handleWindowResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', scheduleParallaxFrame);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] border border-calm-border bg-[linear-gradient(135deg,rgba(124,156,245,0.1),rgba(255,255,255,0.92))] p-7 shadow-soft will-change-transform sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <LandingHowItWorksCard />
        <LandingDoctorSupportCard />
      </div>
    </section>
  );
});

export default LandingTopSupportCard;
