import { useEffect, useRef, type RefObject } from 'react';

export function useParallaxRise<ElementType extends HTMLElement>(
  parallaxRangePixels: number
): RefObject<ElementType | null> {
  const elementRef = useRef<ElementType | null>(null);

  useEffect(() => {
    const targetElement = elementRef.current;
    if (!targetElement) return;

    const reducedMotionMediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    if (reducedMotionMediaQuery.matches) return;

    let animationFrameId = 0;
    let elementTopFromPage = 0;

    function captureElementOrigin() {
      const previousTransform = targetElement!.style.transform;
      targetElement!.style.transform = '';
      const boundingRect = targetElement!.getBoundingClientRect();
      elementTopFromPage = boundingRect.top + window.scrollY;
      targetElement!.style.transform = previousTransform;
    }

    function applyParallaxTransform() {
      const elementHeight = targetElement!.offsetHeight;
      const viewportHeight = window.innerHeight;
      const elementTopRelativeToViewport = elementTopFromPage - window.scrollY;
      const traveledDistance = viewportHeight - elementTopRelativeToViewport;
      const totalTravel = viewportHeight + elementHeight;
      const rawProgress = traveledDistance / totalTravel;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      const parallaxOffset = -clampedProgress * parallaxRangePixels;
      targetElement!.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
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
  }, [parallaxRangePixels]);

  return elementRef;
}
