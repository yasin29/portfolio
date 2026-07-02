import { marqueeCompanies } from '@/lib/profile';

/**
 * Right-to-left scrolling strip of employers & partner organizations.
 * Pure CSS animation (see .marquee in globals.css); the list is rendered twice
 * so the -50% translate loops seamlessly. Pauses on hover, static under
 * prefers-reduced-motion.
 */
export default function Marquee() {
  const items = [...marqueeCompanies];

  return (
    <div className="marquee" aria-label="Companies and partners I have worked with">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-14"
          >
            {items.map((name) => (
              <span key={name} className="flex items-center gap-14">
                <span className="marquee-item">{name}</span>
                <span className="marquee-sep" aria-hidden="true">
                  /
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
