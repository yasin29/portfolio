'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Progressive-enhancement scroll reveal.
 *
 * Mounts once (in the root layout) and observes every [data-reveal] element,
 * adding `is-revealed` as it scrolls into view. The hiding CSS is scoped under
 * the `.reveal-ready` class this component adds to <html>, so with JS disabled
 * (or before hydration) all content stays visible — nothing depends on JS to be seen.
 *
 * Re-runs on every route change. The root layout does not remount during
 * client-side navigation, so without the pathname dependency a back/forward
 * navigation would render a page whose [data-reveal] elements were never
 * observed — they would stay at opacity 0 until a hard reload.
 *
 * Honors prefers-reduced-motion by revealing everything immediately.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    if (reduce || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready');
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

    targets.forEach((el) => {
      if (!el.classList.contains('is-revealed')) io.observe(el);
    });

    // Safety net: if anything is added after this pass (or the observer never
    // fires because the element is already past the viewport on a restored
    // scroll position), reveal whatever is still hidden on the next frame.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.classList.contains('is-revealed')) return;
        const r = el.getBoundingClientRect();
        // In view, or already scrolled past — the latter matters on a
        // back-navigation, where the browser restores the old scroll position
        // and everything above it would otherwise stay hidden.
        if (r.top < window.innerHeight) {
          el.classList.add('is-revealed');
          io.unobserve(el);
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
