import { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.refresh();
}

export const useGSAPReveal = (
  scope: React.RefObject<HTMLElement | null>,
  selector: string,
  vars: gsap.TweenVars = { opacity: 0, y: 50, duration: 1, ease: 'power3.out' },
  scrollTriggerOptions: Partial<ScrollTrigger.Vars> = {}
) => {
  useLayoutEffect(() => {
    if (!scope.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Ensure the selector exists within the scope
      const elements = scope.current?.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      elements.forEach((el) => {
        gsap.from(el, {
          ...vars,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...scrollTriggerOptions,
          },
        });
      });

      // Refresh ScrollTrigger to ensure correct positions
      ScrollTrigger.refresh();
    }, scope.current);

    return () => ctx.revert();
  }, [scope, selector, vars, scrollTriggerOptions]);
};

export const useGSAPParallax = (
  scope: React.RefObject<HTMLElement | null>,
  selector: string,
  yPercent: number = 20,
  scrollTriggerOptions: Partial<ScrollTrigger.Vars> = {}
) => {
  useLayoutEffect(() => {
    if (!scope.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Ensure the selector exists within the scope
      const elements = scope.current?.querySelectorAll(selector);
      if (!elements || elements.length === 0) return;

      elements.forEach((el) => {
        gsap.to(el, {
          yPercent: yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            ...scrollTriggerOptions,
          },
        });
      });

      // Refresh ScrollTrigger to ensure correct positions
      ScrollTrigger.refresh();
    }, scope.current);

    return () => ctx.revert();
  }, [scope, selector, yPercent, scrollTriggerOptions]);
};

export const useGSAPScrollProgress = (
  progressBarSelector: string
) => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const el = document.querySelector(progressBarSelector);
      if (!el) return;

      gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });

      // Refresh ScrollTrigger to ensure correct positions
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [progressBarSelector]);
};

export { ScrollTrigger, gsap };
export default gsap;
