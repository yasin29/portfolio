'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Counts a numeric value up from zero when it first scrolls into view.
 * Handles values like "4 yrs", "3x", "$138K", "+25%" by splitting into
 * prefix + number + suffix and only animating the number. Falls back to the
 * final value immediately under prefers-reduced-motion or without IO support.
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Parsed once per value — MUST be referentially stable so the effect below
  // doesn't tear down its observer/raf on every animation frame.
  const parsed = useMemo(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    return {
      prefix: m[1],
      target: parseFloat(m[2]),
      suffix: m[3],
      decimals: m[2].includes('.') ? m[2].split('.')[1].length : 0,
    };
  }, [value]);

  const [display, setDisplay] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!parsed) return; // non-numeric value: rendered as-is
    const el = ref.current;
    if (!el || done.current) return;

    const finish = () => {
      done.current = true;
      setDisplay(parsed.target);
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      finish();
      return;
    }

    let raf = 0;
    const duration = 1100;

    const io = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min((t - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setDisplay(parsed.target * eased);
          if (p < 1) raf = requestAnimationFrame(step);
          else done.current = true;
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [parsed]);

  if (!parsed) return <span ref={ref}>{value}</span>;

  const shown = display.toLocaleString('en-US', {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });

  return (
    <span ref={ref}>
      {parsed.prefix}
      {shown}
      {parsed.suffix}
    </span>
  );
}
