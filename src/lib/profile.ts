// Canonical structured profile content for the portfolio home page.
// Source of truth: Yasin Billah CV (2026-06-17). Defensible facts only.

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
    'Technical Project Manager with 4 years of experience shipping web and mobile products end-to-end for clients across Japan, Korea, the US, and the EU. I build AI-augmented delivery workflows in Claude Code that have cut average client delivery 3x — from three months to one. I own the full lifecycle: kickoff and budget scoping, sprint planning, cross-functional coordination, UAT, and release.',
  currentlyAt: {
    company: 'Potential Inc.',
    url: 'https://potentialai.com',
    note: 'a Korean software studio',
  },
  availability: 'Open to senior Technical PM roles',
} as const;

export const highlights = [
  { value: '4 yrs', label: 'Technical project management' },
  { value: '3x', label: 'Faster client delivery via AI workflows' },
  { value: '6', label: 'Products shipped in 11 months at Potential Inc.' },
  { value: '9+', label: 'Products delivered end-to-end' },
  { value: '4', label: 'Regions served — JP · KOR · US · EU' },
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
    context: 'Full time · Korean software studio',
    bullets: [
      'Run client kickoffs with tech-stack guidance and budget scoping; own WBS, sprint planning, daily standups, and weekly stakeholder reports.',
      'Shipped 6 web and mobile products end-to-end in 11 months — a dental-restoration lab platform ($138K H1 2026 US/CA sales), an AI artwork-recognition app, an art-appraisal marketplace, a TCG marketplace app, a B2B Premier League ticket platform, and a Korea social-discovery app.',
      'Built AI-augmented delivery workflows in Claude Code — with n8n and Notion — that cut average client delivery 3x, from roughly three months to one, serving JP / KOR / US / EU clients.',
      'Coordinate design, engineering, and QA across each build, and own app-store submission, UAT cycles, and release management. Also built the internal AI-augmented PM Dashboard.',
    ],
  },
  {
    company: 'Kawaii Advanced Technology & Solution Ltd.',
    role: 'Project Manager',
    period: 'Feb 2024 – May 2025',
    context: 'Dhaka · Bangladesh–Japan cross-border delivery',
    bullets: [
      'Ran three offshore engineering teams across BD–JP delivery — sprint planning, daily standups, and weekly client meetings with Japanese stakeholders.',
      'Delivered ERP, SaaS, and full-stack engagements: JTBS ERP (apparel — JB TEX BD & Hameem Group), DET Bridge (Japan’s first DET prep SaaS), LifeArk-nihongo & Achieve Japan LMS, and Findy Job & Futurenation (BD–JP job placement).',
      'Owned documentation across PRD / BRD / SRS, UAT, and release management. Partners included NTT Docomo, Persol Group, UNDP, and Bangladesh’s ICT Division.',
    ],
  },
  {
    company: 'InsideMaps Dhaka',
    role: 'Quality Control Specialist',
    period: 'May 2023 – Dec 2024',
    context: 'Dhaka · Async with US product team',
    bullets: [
      'Authored test cases and ran nightly regression sweeps on a real-estate 3D-tour pipeline.',
    ],
  },
  {
    company: 'Care-box Ltd.',
    role: 'Front-End Web Developer',
    period: 'Aug 2022 – Apr 2023',
    context: 'Dhaka · eHealth product',
    bullets: [
      'Shipped React and Next.js front-ends — built the production-code reading habit that still backs how I work as a PM.',
    ],
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Delivery & Project Management',
    items: [
      'Agile / Scrum',
      'Cross-border delivery',
      'WBS',
      'Sprint planning',
      'Daily standups',
      'UAT',
      'Release management',
      'App-store submission',
      'PM & QA dual ownership',
      'Multi-discipline team coordination',
      'Client & executive reporting',
    ],
  },
  {
    title: 'Product & Documentation',
    items: [
      'PRD',
      'BRD',
      'FRD',
      'SRS',
      'Test cases',
      'Handover documentation',
      'Project budgeting',
      'Tech-stack guidance at kickoff',
    ],
  },
  {
    title: 'AI & Automation',
    items: ['AI workflow design', 'Claude Code', 'Anthropic API', 'OpenAI API', 'n8n', 'Notion'],
  },
  {
    title: 'Tools',
    items: ['Jira', 'Confluence', 'Notion', 'Slack', 'Figma', 'Lucidchart', 'GitHub Actions'],
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
    note: 'CGPA 3.14/4.0 · Publication: "Aspect-Based Sentiment Analysis (ABSA) in the Bangla Language" — early Bangla NLP research',
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
    body: 'AI workflows I build in Claude Code, n8n, and Notion have cut average client delivery 3x — without dropping the quality bar.',
  },
  {
    title: 'PM + QA dual ownership',
    body: 'I own both the plan and the quality bar: UAT, release management, and app-store submission included.',
  },
  {
    title: 'Reporting that says what shipped',
    body: 'Weekly stakeholder and executive reports that track real delivery, not activity theatre.',
  },
];
