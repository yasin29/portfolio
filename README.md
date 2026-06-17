# Portfolio Site — yasinbillah.com

Next.js 15 (App Router) · TypeScript · Tailwind v4 · MDX for case studies · deploys to Vercel.

## Quickstart

```powershell
cd D:\pm-job-search-2026\portfolio
npm install
npm run dev          # http://localhost:3000
```

If `npm install` fails on a Windows path, prefer **pnpm** or **yarn** as alternatives — equivalent commands.

## Stack rationale

- **Next.js 15 App Router** — file-based routing, server components by default, easy MDX integration.
- **TypeScript** — recruiters increasingly assume it.
- **Tailwind v4** — fastest theming + zero CSS file fights.
- **MDX** — case studies live as `.md(x)` files under `content/case-studies/` so they're greppable and copyable into a resume bullet.
- **Vercel** — one-click deploy from a git push.

## File layout

```
portfolio/
├── content/
│   └── case-studies/      # MDX files (sym-link or copy of ../case-studies/*.md)
├── public/
│   ├── case-studies/      # Hero images per case study
│   └── og/                # OpenGraph images
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # Home
│   │   ├── about/page.tsx
│   │   ├── case-studies/
│   │   │   ├── page.tsx                   # Index
│   │   │   └── [slug]/page.tsx            # Case study detail
│   │   ├── globals.css
│   │   └── opengraph-image.tsx
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── CaseStudyCard.tsx
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── case-studies.ts                # MDX loader
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Working with case studies

Case studies are written once in `../case-studies/*.md`. Two options to consume them in the portfolio:

### Option A — Sync (copy)
```powershell
Copy-Item D:\pm-job-search-2026\case-studies\*.md D:\pm-job-search-2026\portfolio\content\case-studies\ -Force
```

### Option B — Symlink (one-time)
```powershell
# Run as admin
New-Item -ItemType SymbolicLink -Path D:\pm-job-search-2026\portfolio\content\case-studies -Target D:\pm-job-search-2026\case-studies
```

**Recommended:** Option A. Run the copy command before `npm run dev` or wire it into `package.json` as `predev` / `prebuild` scripts.

## Deploy to Vercel

```powershell
npm install -g vercel
vercel login
vercel               # first deploy → asks 2 questions
vercel --prod        # production deploy
```

Connect your custom domain in the Vercel dashboard → Settings → Domains. The default `*.vercel.app` URL works for early shares before the domain resolves.

## Lighthouse target

Run after first deploy:
```powershell
npx lighthouse https://<your-vercel-url> --view
```

Target: ≥ 90 on Performance / Accessibility / Best Practices / SEO. If you fall short, biggest wins are usually image optimization (`next/image`) and font loading.

## What's not scaffolded yet (do these manually)

- Hero images per case study — drop into `public/case-studies/<slug>/hero.png`
- OpenGraph image — `src/app/opengraph-image.tsx` (1200×630)
- Favicon — `src/app/favicon.ico`
- Analytics — Vercel Web Analytics (one toggle in dashboard) or Plausible
- Contact form — recommend a `mailto:` link first, then a real form (Formspree / Resend) if needed

## Future ideas (post-launch)

- `/now` page — Derek Sivers-style "what I'm working on this month"
- `/uses` page — your tools, fonts, hardware
- RSS for blog posts (once you start writing)
- Dark mode toggle (Tailwind v4 makes this trivial)
