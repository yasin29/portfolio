'use client';

import { useEffect } from 'react';

/**
 * Progressive-enhancement scroll reveal.
 *
 * Mounts once (in the root layout) and observes every [data-reveal] element,
 * adding `is-revealed` as it scrolls into view. The hiding CSS is scoped under
 * the `.reveal-ready` class this component adds to <html>, so with JS disabled
 * (or before hydration) all content stays visible — nothing depends on JS to be seen.
 *
 * Honors prefers-reduced-motion by revealing everything immediately.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    root.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-revealed');
          obs.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    targets.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
