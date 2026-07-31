import { impact } from '@/lib/profile';

function Icon({ name }: { name: 'delivery' | 'growth' | 'scale' }) {
  if (name === 'delivery') {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 17l5.5-5.5 3.5 3.5L21 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 6h6v6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'growth') {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 20V11M12 20V4M19 20v-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 5.4a3.2 3.2 0 010 5.2M18 19c0-2.3-1-3.8-2.6-4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Quantified results, grouped by theme. Each figure is a real number from the
 * CV shown as a value chip — deliberately not a proportional bar, since these
 * are absolute outcomes rather than percentages of a target.
 */
export default function Impact() {
  return (
    <div className="impact-panel">
      {impact.map((g) => (
        <div key={g.category} className="impact-row">
          <div>
            <span className="impact-cat-icon">
              <Icon name={g.icon} />
            </span>
            <p className="impact-cat-label">{g.category}</p>
            <p className="impact-cat-blurb">{g.blurb}</p>
          </div>

          <dl className="impact-metrics">
            {g.metrics.map((m) => (
              <div key={m.label} className="impact-metric">
                <div className="min-w-0">
                  <dt className="impact-metric-name">{m.label}</dt>
                  <dd className="impact-metric-detail">{m.detail}</dd>
                </div>
                <span className="impact-value">{m.value}</span>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
