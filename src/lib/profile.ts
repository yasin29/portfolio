// Canonical structured profile content for the portfolio home page.
// Source of truth: Yasin Billah CV — "Technical Project Manager" (2026). Defensible facts only.
// Positioning: Technical Project Manager / Technical Product Manager. 4 years in the software
// industry, 3 years as a project manager. Available on-site and remote. Country references
// (JP / KR / US / EU) belong in the story/about copy, not the hero tagline.
// Note: per owner preference, "user story" phrasing is intentionally omitted.

// Set at build time (e.g. "/portfolio" for GitHub Pages project sites); empty in dev/Vercel.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const profile = {
  name: 'Yasin Billah',
  role: 'Technical Project Manager',
  roleSecondary: 'Technical Product Manager',
  tagline:
    'I ship web application and mobile app products end-to-end — technical product management with AI-augmented delivery.',
  location: 'ECB, Dhaka, Bangladesh',
  timezone: 'GMT+6',
  workMode: 'On-site & remote',
  focus: 'Web, mobile & AI product delivery',
  email: 'yasinbillah46@gmail.com',
  phone: '+880 1784 468706',
  whatsapp: 'https://wa.me/8801784468706',
  resume: `${basePath}/Technical_project_manager_Yasin_Billah.pdf`,
  photo: `${basePath}/yasin-billah.png`,
  socials: {
    linkedin: 'https://linkedin.com/in/yasin-billah',
    github: 'https://github.com/yasin29',
  },
  currentlyAt: {
    company: 'Potential Inc.',
    url: 'https://potentialai.com',
    note: 'a South Korea-based software farm',
  },
  availability: 'Open to new opportunities',
  languages: 'English — Fluent · Bengali — Native',
} as const;

export const languages = [
  { name: 'Bengali', level: 'Native', pct: 100 },
  { name: 'English', level: 'Fluent', pct: 90 },
] as const;

/* ---------- Hero ---------- */

export const highlights = [
  { value: '4 yrs', label: 'In the software industry' },
  { value: '3 yrs', label: 'Of those as project manager' },
  { value: '3x', label: 'Faster client delivery (3 months → 1)' },
  { value: '6', label: 'Products shipped end-to-end in the last 11 months' },
  { value: '$138K', label: 'Platform sales — dental-lab client (H1 2026)' },
  { value: '2', label: 'SaaS products launched' },
] as const;

/* ---------- Company marquee ---------- */

// Products delivered + client/partner organizations (not employers).
export const marqueeCompanies = [
  'Ivorymade',
  'Artlive',
  'Bside',
  'Trustix',
  'Thrll',
  'Cart Traders',
  'Ktalk',
  'Elite4print',
  'NTT Docomo',
  'Persol Group',
  'Findy Team+',
  'Futurenation',
  'UNDP',
  'ICT Division (BD)',
  'Achieve Japan',
  'LifeArk',
  'JTBS ERP',
  'DET Bridge',
  'Hameem Group',
  'JB TEX BD',
  'Care-box',
] as const;

/* ---------- The story ---------- */

export const story = {
  statementLead: 'I take products from ',
  statementEm: 'kickoff to launch',
  statementTail: ' — planning, execution, QA, and release — without dropping the quality bar.',
  chips: [
    'End-to-End Delivery',
    'AI-Native Workflows',
    'Web & Mobile',
    'Agile / Scrum',
    'QA & UAT Ownership',
    'Release Management',
  ],
  paragraphs: [
    'Four years in the software industry — I started as a front-end developer, moved through QA, and have spent the last three running projects end-to-end. That path means I read the code, debate scope with engineers, and translate cleanly between technical and non-technical stakeholders.',
    'As a project manager I have shipped marketplaces, mobile-AI apps, ERP, and SaaS for clients across Japan, Korea, the US, and the EU. The AI-native delivery workflows I build in Claude Code, n8n, and Notion cut average client delivery from three months to one.',
  ],
} as const;

export const howIOperate = [
  {
    title: 'Ownership, end to end',
    body: 'I take each project as my own — I learn the client’s business and goals, then shape scope and trade-offs to get the best outcome, not just ship tickets.',
  },
  {
    title: 'AI as leverage',
    body: 'AI workflows I build in Claude Code, n8n, and Notion cut average client delivery from three months to one — without dropping the quality bar.',
  },
  {
    title: 'PM & QA dual hat',
    body: 'I own both the plan and the quality bar: hands-on UAT and QA cycles, release management, and app-store submission.',
  },
] as const;

/* ---------- Capabilities ---------- */

export const capabilities = {
  intro:
    'I pair project leadership with the technical depth to ship, not just spec. Four years turning ambiguous requirements into launched products across marketplaces, EdTech, ERP, mobile-AI, and HR-tech.',
  expertise: [
    {
      title: 'Project Leadership',
      detail:
        'Agile / Scrum · WBS & man-hour estimation · Sprint planning · Risk & change control · Stakeholder reporting',
    },
    {
      title: 'AI & Automation',
      detail:
        'AI-native workflow design · Claude Code · Cursor · n8n · Notion-based delivery systems',
    },
    {
      title: 'Delivery & Quality',
      detail: 'Hands-on QA · UAT cycles · Release management · App-store submission',
    },
    {
      title: 'Technical Fluency',
      detail: 'JavaScript · Python · React · Next.js · React Native · Node.js',
    },
  ],
  philosophy: {
    quote:
      'I’m the hub between team and stakeholders — I give developers cover and confidence, pull delivery out of trouble when it slips, and steer clients in the right direction. Hand me a kickoff and a deadline; I’ll hand back a shipped product.',
    name: 'Yasin Billah',
    role: 'Technical Project Manager',
  },
  toolkit: [
    'Jira',
    'Confluence',
    'Notion',
    'Slack',
    'Figma',
    'Lucidchart',
    'GitHub Actions',
    'Claude Code',
    'n8n',
    'Cursor',
  ],
  openTo: {
    body: 'Technical Project Manager and Technical Product Manager roles — on-site or remote, with teams shipping internationally. Especially at home in AI-native products and workflows.',
    chips: ['Technical PM', 'Technical Product Manager', 'AI-Native Delivery'],
  },
} as const;

/* ---------- Experience / journey ---------- */

export type Experience = {
  company: string;
  url?: string;
  role: string;
  period: string;
  context: string;
  blurb: string;
  /** Compact role → project lists shown on the journey card. */
  portfolio?: { label: string; items: string }[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: 'Potential Inc.',
    url: 'https://potentialai.com/',
    role: 'Project Manager',
    period: 'Jun 2025 – Present',
    context: 'South Korea-based software farm',
    blurb:
      'Running every project end-to-end — pre-sale kickoff to launch. 6 products shipped in 11 months: 4 on legacy 3-month timelines, 2 with AI-native project management.',
    portfolio: [
      { label: 'Project Manager', items: 'Ivorymade · Artlive · Bside (app) · Trustix · Thrll (app) · Cart Traders (app)' },
      { label: 'Product Manager', items: 'Ktalk — Korean LMS app (took over)' },
      { label: 'Took over as PM', items: 'Elite4print · Activity Coaching' },
    ],
    bullets: [
      'Ran every project end-to-end — from pre-sale kickoff with prospects through to product launch — bridging business strategy and engineering execution for cross-functional teams of engineers, designers, and QA.',
      'Shipped 6 web and mobile products in 11 months: 4 delivered on legacy-system 3-month timelines, and 2 (Bside, Cart Traders) with AI-native project management built in Claude Code, n8n, and Notion — cutting delivery from 3 months to 1.',
      'Project Manager for Ivorymade (dental-restoration lab platform, $138K US & Canada sales in H1 2026), Artlive (art-appraisal marketplace), Bside (AI artwork-recognition app), Trustix, Thrll, and Cart Traders (TCG marketplace app); took over Elite4print and Activity Coaching as PM, and Ktalk (Korean LMS app) as Product Manager.',
      'Owned planning and scope from kickoff: communication strategy, requirement translation, a deliverable-oriented WBS with man-hour estimation, resource and budget plans, and proactive risk assessment before development began.',
      'Ran execution and delivery: daily standups in Notion and the internal PM Dashboard ticket system as single source of truth, variance analysis and timely escalations, change control with stakeholder buy-in, weekly stakeholder reports, hands-on QA and UAT cycles, plus app-store submission and release management.',
      'Architected Potential’s end-to-end Agile/Scrum delivery system in Notion and served as Product Owner of PM Dashboard — the in-house AI ops platform centralizing Slack, Google Meet, GitHub, and Notion.',
    ],
  },
  {
    company: 'Kawaii Advanced Technology & Solution Ltd.',
    url: 'https://kawaiibd.com/',
    role: 'Project Manager',
    period: 'Feb 2024 – May 2025',
    context: 'Japan–Bangladesh joint venture',
    blurb:
      'Led 3 offshore engineering teams across cross-border delivery — ERP, SaaS, and full-stack engagements with Japanese stakeholders.',
    portfolio: [
      { label: 'Project Manager', items: 'Futurenation · Findy Team+ · JTBS ERP · Japanese-language LMS (ICT Division)' },
      { label: 'Product Manager', items: 'DET Bridge (Duolingo test prep app) · LifeArk LMS app · Achieve Japan LMS · JP–BD cross-border e-commerce marketplace' },
    ],
    bullets: [
      'Ran 3 offshore engineering teams across Bangladesh–Japan delivery, leading sprint planning in Jira, daily standups, and weekly client meetings with Japanese stakeholders.',
      'Owned requirements and feedback cycles in Jira and Confluence, documentation across PRD / BRD / SRS, plus UAT and release management for ERP, SaaS, and full-stack engagements.',
      'Project Manager for Futurenation, Findy Team+, JTBS ERP (apparel — JB TEX BD & Hameem Group), and a Japanese-language LMS for Bangladesh’s ICT Division. Partners: NTT Docomo, Persol Group, UNDP.',
      'Product Manager for DET Bridge (Japan’s first Duolingo English Test prep SaaS), LifeArk LMS, Achieve Japan LMS (Japanese language, SSW training, IT-engineer training), and a JP–BD cross-border e-commerce marketplace.',
    ],
  },
  {
    company: 'InsideMaps Dhaka',
    url: 'https://www.insidemaps.com/',
    role: 'Quality Control Analyst',
    period: 'May 2023 – Dec 2023',
    context: 'Real-estate 3D virtual-tour platform · US team',
    blurb:
      'Authored test cases and ran nightly regression sweeps on a real-estate 3D-tour pipeline for a Redwood City, CA team.',
    bullets: [
      'Authored test cases and ran nightly regression sweeps on a real-estate 3D-tour pipeline.',
    ],
  },
  {
    company: 'Care-box Ltd.',
    url: 'https://www.care-box.com/',
    role: 'Front-End Web Developer',
    period: 'Aug 2022 – May 2023',
    context: 'eHealth product · Dhaka',
    blurb:
      'Shipped React and Next.js front-ends for an eHealth product — the production-code habit that still informs how I work as a PM.',
    bullets: [
      'Shipped React and Next.js front-ends for an eHealth product — built the production-code reading habit that still informs how I work as a PM today.',
    ],
  },
];

/* ---------- By the numbers ---------- */

export const numbers = [
  { value: '$138K', label: 'US & Canada sales — dental-lab platform (H1 2026)' },
  { value: '3x', label: 'Faster client delivery — 3 months to 1' },
  { value: '6', label: 'Products shipped end-to-end in the last 11 months' },
  { value: '+25%', label: 'MAU after gamified LMS relaunch' },
  { value: '2', label: 'SaaS products launched' },
  { value: '3', label: 'Offshore engineering teams led' },
  { value: '8', label: 'End-to-end case studies documented' },
  { value: '4', label: 'Client regions worldwide' },
] as const;

/* ---------- Skills ---------- */

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

/* ---------- Credentials ---------- */

export type Certification = { name: string; issuer?: string; id?: string; url?: string };

export const certifications: Certification[] = [
  {
    name: 'Scrum Fundamentals Certified',
    issuer: 'SCRUMstudy',
    id: '1088542',
    url: 'https://www.scrumstudy.com/certification/verify?type=SFC&number=1088542',
  },
  {
    name: 'Scrum Foundation Professional (SFPC)',
    issuer: 'CertiProf',
    id: '84114373',
    url: 'https://free.certiprof.com/products/2148816897',
  },
  {
    name: 'Atlassian Agile Project Management Professional',
    issuer: 'Atlassian',
    url: 'https://www.linkedin.com/learning/browse/certifications',
  },
  { name: 'Product Analytics Micro-Certification (PAC™)', id: 'cert_y93jppgk' },
];

export type Education = {
  degree: string;
  school: string;
  period: string;
  note?: string;
  url?: string;
};

export const education: Education[] = [
  {
    degree: 'B.Sc. in Information & Communication Engineering',
    school: 'Bangladesh University of Professionals',
    period: '2017 – 2021',
    note: 'CGPA 3.14/4.0',
    url: 'https://bup.edu.bd/',
  },
  {
    degree: 'Higher Secondary Certificate',
    school: 'Notre Dame College, Dhaka',
    period: '2013 – 2015',
    note: 'GPA 5.00/5.00',
    url: 'https://ndc.edu.bd/',
  },
];

export const publication = {
  title: '"Aspect-Based Sentiment Analysis (ABSA) in the Bangla Language"',
  venue: 'B.Sc. research publication · Bangladesh University of Professionals',
} as const;

/* ---------- Principles (kept for reuse in prose/about) ---------- */

export const principles = [
  {
    title: 'Ownership',
    body: 'I take each project as my own — I learn the client’s business and goals, then shape scope and trade-offs to get the best outcome, not just ship tickets.',
  },
  {
    title: 'Central orchestrator',
    body: 'I’m the hub across team and stakeholders: I give developers cover and confidence, pull delivery out of trouble when it slips, and steer clients in the right direction.',
  },
  {
    title: 'Product sense',
    body: 'I know what makes a product good — design and function — which sharpens client communication, cuts revision cycles, and makes my feedback to designers and developers actually improve the build.',
  },
  {
    title: 'AI-augmented delivery',
    body: 'AI workflows I build in Claude Code, n8n, and Notion cut average client delivery from three months to one — without dropping the quality bar.',
  },
  {
    title: 'PM & QA dual hat',
    body: 'I own both the plan and the quality bar: I run UAT and QA hands-on, plus release management and app-store submission.',
  },
  {
    title: 'Kickoff with budget & stack',
    body: 'I scope budget and tech stack at kickoff, so delivery starts from a realistic plan instead of a guess.',
  },
];
