// Describes each editable collection so the admin renders real editors rather
// than raw JSON. Field shapes mirror exactly what the public site renders, so
// what you fill in here is what a visitor sees.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'list'
  | 'select'
  | 'image'
  | 'file'
  | 'group'
  | 'repeat'
  | 'json';

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  /** select only */
  options?: string[];
  /** group / repeat only */
  fields?: FieldDef[];
  /** repeat only — which sub-field titles each row */
  titleField?: string;
  /** repeat only — wording on the add button */
  addLabel?: string;
};

export type SectionDef = {
  key: string;
  label: string;
  kind: 'object' | 'list';
  hint?: string;
  titleField?: string;
  subtitleField?: string;
  /** list only — the field used to name new AI-composed case studies */
  slugField?: string;
  fields: FieldDef[];
};

const t = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'text', hint });
const ta = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'textarea', hint });
const url = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'url', hint });
const list = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'list', hint });
const img = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'image', hint });
const file = (key: string, label: string, hint?: string): FieldDef => ({ key, label, type: 'file', hint });
const sel = (key: string, label: string, options: string[], hint?: string): FieldDef => ({
  key, label, type: 'select', options, hint,
});

/** {value,label} tiles — used by hero metrics, project stats, experience stats. */
const STAT_FIELDS: FieldDef[] = [
  t('value', 'Value', 'e.g. 3x, $138K, 6'),
  t('label', 'Label', 'What the number counts'),
];

/** An image with the alt text and caption the site actually renders. */
const IMAGE_FIELDS: FieldDef[] = [
  img('src', 'Image', 'Upload, or a path under /public'),
  t('alt', 'Alt text', 'Describe what the screenshot shows — used by search engines and screen readers'),
  t('caption', 'Caption', 'Shown under the image'),
];

/** One numbered accordion section in the project drawer. */
const DRAWER_SECTION_FIELDS: FieldDef[] = [
  t('title', 'Section title', 'e.g. The problem, Delivery process'),
  ta('body', 'Body', 'A short paragraph — what you did and why'),
  t('quote', 'Pull quote', 'Optional. One line worth highlighting'),
  list('chips', 'Tags', 'One per line'),
];

export const SECTIONS: SectionDef[] = [
  {
    key: 'profile',
    label: 'Profile & contact',
    kind: 'object',
    hint: 'Name, title, contact details, and the hero intro line.',
    fields: [
      t('name', 'Name'),
      t('role', 'Job title', 'Shown in the hero and used across SEO'),
      t('roleSecondary', 'Secondary label', 'Appears after the title, e.g. AI-Native Delivery'),
      ta('tagline', 'Hero intro', 'The paragraph under your name — two or three lines'),
      t('availability', 'Availability badge'),
      t('location', 'Location'),
      t('timezone', 'Timezone'),
      t('workMode', 'Work mode'),
      t('focus', 'Focus'),
      t('email', 'Email'),
      t('phone', 'Phone'),
      url('whatsapp', 'WhatsApp link'),
      img('photo', 'Photo', 'Square headshot'),
      img('photoCutout', 'Hero portrait', 'Background removed — sits in the hero circle'),
      file('resume', 'Resume file', 'Upload a PDF, or type a path already in /public'),
      {
        key: 'socials', label: 'Social links', type: 'group',
        fields: [url('linkedin', 'LinkedIn'), url('github', 'GitHub')],
      },
      {
        key: 'currentlyAt', label: 'Currently at', type: 'group',
        fields: [t('company', 'Company'), url('url', 'Website'), t('note', 'Description')],
      },
      t('languages', 'Languages line'),
    ],
  },

  {
    key: 'projects',
    label: 'Projects',
    kind: 'list',
    hint: 'Everything in the Work grid. Category drives the filter tabs; sections drive the drawer.',
    titleField: 'name',
    subtitleField: 'solution',
    slugField: 'slug',
    fields: [
      t('name', 'Project name', 'The brand or product name'),
      t('solution', 'What it is', 'Led with on the card, e.g. Art-Appraisal Marketplace'),
      t('slug', 'Slug', 'Unique, lowercase-kebab. Used in the URL'),
      sel('category', 'Category', ['client', 'owned', 'inhouse', 'personal'],
        'client = for an external client · owned = you were Product Manager · inhouse = internal · personal = your own'),
      t('domain', 'Domain label', 'Card eyebrow, e.g. B2B SaaS · Dental Tech'),
      t('org', 'Organisation', 'Employer, or Self-directed'),
      t('role', 'Your role'),
      t('period', 'Period', 'Use month names, e.g. Jun 2025 – Present'),
      sel('approach', 'Delivery approach', ['', 'AI-native', 'Legacy']),
      t('team', 'Team size', 'e.g. 5 team members, Solo'),
      ta('summary', 'Card summary', 'One or two sentences shown on the card and at the top of the drawer'),
      url('live', 'Live URL', 'Adds a LIVE badge and a Visit button'),
      t('caseStudy', 'Case-study slug', 'Links the drawer to a full case study'),
      img('preview', 'Card image', 'The thumbnail on the Work grid'),
      { key: 'stats', label: 'Stat tiles', type: 'repeat', fields: STAT_FIELDS, titleField: 'label', addLabel: 'stat' },
      list('stack', 'Stack', 'One per line'),
      {
        key: 'sections', label: 'Drawer sections', type: 'repeat', fields: DRAWER_SECTION_FIELDS,
        titleField: 'title', addLabel: 'section',
        hint: 'The numbered accordion inside the drawer. This is where the detail lives.',
      },
      {
        key: 'feedback', label: 'Client feedback', type: 'group',
        hint: 'Only ever a real client quote — leave empty rather than filling the space',
        fields: [
          ta('quote', 'Quote', 'What the client actually said'),
          t('attribution', 'Attribution', 'e.g. Client, Cart Traders'),
        ],
      },
      { key: 'livePreview', label: 'Live-product image', type: 'group', fields: IMAGE_FIELDS },
      list('contribution', 'Fallback bullets', 'Only used if there are no sections'),
    ],
  },

  {
    key: 'experience',
    label: 'Work experience',
    kind: 'list',
    hint: 'The journey rail. Newest first.',
    titleField: 'company',
    subtitleField: 'role',
    fields: [
      t('company', 'Company'),
      t('role', 'Role'),
      t('period', 'Period', 'Month names, e.g. Jun 2025 – Present'),
      t('context', 'Context', 'One line about the company'),
      url('url', 'Company URL'),
      ta('blurb', 'Summary'),
      list('bullets', 'Bullets', 'One per line'),
      {
        key: 'chips', label: 'Project chips', type: 'repeat', titleField: 'label', addLabel: 'chip',
        fields: [t('label', 'Label'), t('href', 'Link', 'Optional, e.g. /case-studies/ivory')],
      },
      { key: 'stats', label: 'Stat tiles', type: 'repeat', fields: STAT_FIELDS, titleField: 'label', addLabel: 'stat' },
      {
        key: 'projects', label: 'Project rows', type: 'repeat', titleField: 'name', addLabel: 'project',
        fields: [t('name', 'Name'), t('tagline', 'Tagline'), ta('detail', 'Detail')],
      },
    ],
  },

  {
    key: 'highlights',
    label: 'Hero metrics',
    kind: 'list',
    hint: 'The strip of numbers under the hero.',
    titleField: 'value',
    subtitleField: 'label',
    fields: STAT_FIELDS,
  },

  {
    key: 'impact',
    label: 'Impact numbers',
    kind: 'list',
    titleField: 'category',
    fields: [
      t('category', 'Category'),
      sel('icon', 'Icon', ['delivery', 'growth', 'scale']),
      ta('blurb', 'Blurb'),
      {
        key: 'metrics', label: 'Metrics', type: 'repeat', titleField: 'label', addLabel: 'metric',
        fields: [t('value', 'Value'), t('label', 'Label'), ta('detail', 'Detail')],
      },
    ],
  },

  {
    key: 'pmProcess',
    label: 'How I run projects',
    kind: 'list',
    titleField: 'title',
    subtitleField: 'caption',
    fields: [t('title', 'Stage'), t('caption', 'Caption'), ta('body', 'Body'), list('methods', 'Methods')],
  },

  {
    key: 'education',
    label: 'Education',
    kind: 'list',
    titleField: 'degree',
    subtitleField: 'school',
    fields: [t('degree', 'Degree'), t('school', 'School'), t('period', 'Period'), t('note', 'Note'), url('url', 'URL')],
  },

  {
    key: 'certifications',
    label: 'Certifications',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'issuer',
    fields: [t('name', 'Name'), t('issuer', 'Issuer'), t('id', 'Credential ID'), url('url', 'Verify URL')],
  },

  {
    key: 'skillGroups',
    label: 'Skills',
    kind: 'list',
    titleField: 'title',
    fields: [t('title', 'Group'), list('items', 'Skills', 'One per line')],
  },

  {
    key: 'coreCompetencies',
    label: 'Core competencies',
    kind: 'list',
    titleField: 'title',
    fields: [t('title', 'Title'), ta('items', 'Detail')],
  },

  {
    key: 'languages',
    label: 'Languages',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'level',
    fields: [t('name', 'Language'), t('level', 'Level'), t('pct', 'Bar %')],
  },

  {
    key: 'principles',
    label: 'Principles',
    kind: 'list',
    titleField: 'title',
    fields: [t('title', 'Title'), ta('body', 'Body')],
  },

  {
    key: 'marqueeCompanies',
    label: 'Marquee names',
    kind: 'list',
    hint: 'The scrolling strip of client and partner names.',
    titleField: '__self',
    fields: [t('__self', 'Name')],
  },

  { key: '__password', label: 'Change password', kind: 'object', fields: [] },
];
