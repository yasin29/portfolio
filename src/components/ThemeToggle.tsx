'use client';

/**
 * Light / dark theme switch.
 *
 * The theme lives in `document.documentElement.dataset.theme` and is stamped by
 * the inline script in the root layout before first paint, so there is no flash
 * and no hydration mismatch. This button only flips that attribute and persists
 * the choice — it holds no React state, and both icons are always rendered so
 * the server and client markup are identical (CSS reveals the right one).
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode / storage disabled — the toggle still works for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      {/* shown in dark mode — click for light */}
      <svg
        className="icon-sun"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2m20 0h-2.2M5.8 5.8L4.3 4.3m15.4 15.4l-1.5-1.5M5.8 18.2l-1.5 1.5M19.7 4.3l-1.5 1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {/* shown in light mode — click for dark */}
      <svg
        className="icon-moon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 13.4A8.2 8.2 0 1110.6 4a6.6 6.6 0 009.4 9.4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
