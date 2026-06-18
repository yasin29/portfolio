// Canonical structured profile content for the portfolio home page.
// Source of truth: Yasin Billah CV — "Technical Project Manager" (2026). Defensible facts only.
// Note: per owner preference, "remote" and "user story" phrasing is intentionally omitted
// even though the CV uses them.

// Set at build time (e.g. "/portfolio" for GitHub Pages project sites); empty in dev/Vercel.
// Exported so components can prefix static asset URLs (next/image doesn't do this for
// unoptimized sources under a basePath).
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const profile = {
  name: 'Yasin Billah',
  role: 'Technical Project Manager',
  tagline: 'I ship web and mobile products end-to-end — with AI-augmented delivery.',
  location: 'Dhaka, Bangladesh',
  timezone: 'Dhaka · GMT+6',
  email: 'yasinbillah46@gmail.com',
  phone: '+880 1784 468706',
  resume: `${basePath}/Yasin-Billah-Resume.pdf`,
  socials: {
    linkedin: 'https://linkedin.com/in/yasin-billah',
    github: 'https://github.com/yasin29',
  },
  intro:
    'Technical Project Manager with 4 years of experience running software projects end-to-end — from pre-sale kickoff to launch — for clients across Japan, Korea, the US, and the EU. I build AI-augmented delivery workflows in Claude Code (with n8n and Notion) that cut average client delivery from three months to one, and own the full lifecycle: budget and scope at kickoff, WBS, execution, QA and UAT, and release.',
  currentlyAt: {
    company: 'Potential Inc.',
    url: 'https://potentialai.com',
    note: 'a South Korea-based software farm',
  },
  availability: 'Open to senior Technical PM roles',
  languages: 'English — Fluent · Bengali — Native',
} as const;

export const highlights = [
  { value: '4 yrs', label: 'Technical project management' },
  { value: '3x', label: 'Faster client delivery (3 months → 1 month)' },
  { value: '6', label: 'Products shipped in 11 months at Potential Inc.' },
  { value: '$138K', label: 'US & Canada sales — dental-lab platform (H1 2026)' },
  { value: '4', label: 'Client regions — JP · KOR · US · EU' },
  { value: '2', label: 'SaaS products launched' },
] as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  context: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: 'Potential Inc.',
    role: 'Project Manager',
    period: 'Jun 2025 – Present',
    context: 'South Korea-based software farm',
    bullets: [
      'Ran every project end-to-end — from pre-sale kickoff with prospects through to product launch — bridging business strategy and engineering execution for cross-functional teams of engineers, designers, and QA.',
      'Built AI workflows in Claude Code (with n8n and Notion) that cut average client delivery from 3 months to 1 month, shipping 6 web and mobile products in 11 months for Japanese, Korean, US, and European clients — including a dental-restoration lab platform that generated $138K in US & Canada sales in H1 2026, an AI artwork-recognition app, an art-appraisal marketplace, a TCG marketplace app, a B2B Premier League ticket platform, and a Korea social-discovery app.',
      'Owned planning and scope from kickoff: communication strategy, requirement translation, a deliverable-oriented WBS with man-hour estimation, resource and budget plans, and proactive risk assessment before development began.',
      'Ran execution and delivery: daily standups in Notion and the internal PM Dashboard ticket system as single source of truth, variance analysis and timely escalations, change control with stakeholder buy-in, weekly stakeholder reports, hands-on QA and UAT cycles, plus app-store submission and release management.',
      'Architected Potential’s end-to-end Agile/Scrum delivery system in Notion and served as Product Owner of PM Dashboard — the in-house AI ops platform centralizing Slack, Google Meet, GitHub, and Notion.',
    ],
  },
  {
    company: 'Kawaii Advanced Technology & Solution Ltd.',
    role: 'Project Manager',
    period: 'Feb 2024 – May 2025',
    context: 'Dhaka, Bangladesh · Japan–Bangladesh joint venture',
    bullets: [
      'Ran 3 offshore engineering teams across Bangladesh–Japan delivery, leading sprint planning in Jira, daily standups, and weekly client meetings with Japanese stakeholders.',
      'Owned requirements and feedback cycles in Jira and Confluence, documentation across PRD / BRD / SRS, plus UAT and release management for ERP, SaaS, and full-stack engagements.',
      'Delivered JTBS ERP (apparel — JB TEX BD & Hameem Group), DET Bridge (Japan’s first DET prep SaaS), LifeArk-nihongo & Achieve Japan LMS, and Findy Job & Futurenation (BD–JP job placement). Partners: NTT Docomo, Persol Group, UNDP, ICT Division.',
    ],
  },
  {
    company: 'InsideMaps Dhaka',
    role: 'Quality Control Analyst',
    period: 'May 2023 – Dec 2023',
    context: 'Real-estate 3D virtual-tour platform · US team (Redwood City, CA)',
    bullets: [
      'Authored test cases and ran nightly regression sweeps on a real-estate 3D-tour pipeline.',
    ],
  },
  {
    company: 'Care-box Ltd.',
    role: 'Front-End Web Developer',
    period: 'Aug 2022 – May 2023',
    context: 'Dhaka, Bangladesh · eHealth product',
    bullets: [
      'Shipped React and Next.js front-ends for an eHealth product — built the production-code reading habit that still informs how I work as a PM today.',
    ],
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Project Management',
    items: [
      'Agile / Scrum',
      'WBS',
      'Sprint planning',
      'Communication strategy',
      'Requirement translation',
      'UAT',
      'Release management',
      'App-store submission',
      'Automation testing',
    ],
  },
  {
    title: 'AI & Automation',
    items: ['AI workflow design', 'Claude Code', 'Cursor', 'n8n', 'Notion'],
  },
  {
    title: 'Tools',
    items: ['Jira', 'Confluence', 'Slack', 'Figma', 'Lucidchart', 'GitHub Actions'],
  },
  {
    title: 'Technical fluency',
    items: ['JavaScript', 'Python', 'React', 'Next.js', 'React Native', 'Node.js'],
  },
];

export type Certification = { name: string; issuer?: string; id?: string };

export const certifications: Certification[] = [
  { name: 'Scrum Fundamentals Certified', issuer: 'SCRUMstudy', id: '1088542' },
  { name: 'Scrum Foundation Professional (SFPC)', issuer: 'CertiProf', id: '84114373' },
  { name: 'Atlassian Agile Project Management Professional', issuer: 'Atlassian' },
  { name: 'Product Analytics Micro-Certification (PAC™)', id: 'cert_y93jppgk' },
];

export type Education = { degree: string; school: string; period: string; note?: string };

export const education: Education[] = [
  {
    degree: 'B.Sc. in Information & Communication Engineering',
    school: 'Bangladesh University of Professionals',
    period: '2017 – 2021',
    note: 'CGPA 3.14/4.0 · Publication: "Aspect-Based Sentiment Analysis (ABSA) in the Bangla Language"',
  },
  {
    degree: 'Higher Secondary Certificate',
    school: 'Notre Dame College, Dhaka',
    period: '2013 – 2015',
    note: 'GPA 5.00/5.00',
  },
];

export const principles = [
  {
    title: 'Kickoff with budget + stack',
    body: 'I scope budget and tech stack at kickoff, so delivery starts from a realistic plan instead of a guess.',
  },
  {
    title: 'AI-augmented delivery',
    body: 'AI workflows I build in Claude Code, n8n, and Notion cut average client delivery from three months to one — without dropping the quality bar.',
  },
  {
    title: 'PM + QA dual ownership',
    body: 'I own both the plan and the quality bar: I run UAT and QA hands-on, plus release management and app-store submission.',
  },
  {
    title: 'Reporting that says what shipped',
    body: 'Weekly stakeholder and executive reports that track real delivery — variance, escalations, and change control — not activity theatre.',
  },
];
