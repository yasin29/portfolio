import { profile } from '@/lib/profile';

export const metadata = {
  title: 'About — Yasin Billah',
};

export default function About() {
  return (
    <div className="container-prose py-16">
      <article className="prose-custom">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>

        <p>
          I&apos;m a Technical Project Manager based in Dhaka, Bangladesh (GMT+6), with 4 years of
          experience shipping web and mobile products end-to-end. I started in software as a front-end
          developer, moved through QA, and grew into project management — so I can read the code,
          debate scope with engineers, and translate cleanly between technical and non-technical
          stakeholders.
        </p>

        <p>
          At{' '}
          <a href={profile.currentlyAt.url} target="_blank" rel="noreferrer">
            Potential Inc.
          </a>
          , a Korean software studio, I&apos;ve shipped 6 web and mobile products end-to-end in 11
          months for clients across Japan, Korea, the US, and the EU — including a dental-restoration
          lab platform, an AI artwork-recognition app, an art-appraisal marketplace, a TCG marketplace
          app, a B2B Premier League ticket platform, and a Korea social-discovery app.
        </p>

        <h2>How I work</h2>
        <ul>
          <li>
            <strong>Kickoff with budget + stack.</strong> I scope budget and tech stack at kickoff,
            so delivery starts from a realistic plan.
          </li>
          <li>
            <strong>AI-augmented delivery.</strong> Workflows I build in Claude Code, n8n, and Notion
            cut average client delivery 3x — from three months to one.
          </li>
          <li>
            <strong>PM + QA dual ownership.</strong> I own both the plan and the quality bar — UAT,
            release management, and app-store submission included.
          </li>
          <li>
            <strong>Defensible reporting.</strong> Weekly stakeholder and executive reports that track
            real delivery.
          </li>
        </ul>

        <h2>Background</h2>
        <p>
          Before Potential Inc., I spent 15 months at Kawaii Advanced Technology running three
          offshore engineering teams across the Bangladesh–Japan corridor — delivering ERP, SaaS, and
          full-stack engagements with partners including NTT Docomo, Persol Group, UNDP, and
          Bangladesh&apos;s ICT Division. B.Sc. in Information &amp; Communication Engineering from
          Bangladesh University of Professionals (2021).
        </p>

        <h2>What I&apos;m looking for</h2>
        <p>
          A senior Technical PM seat at a team shipping a product I&apos;d use. Comfortable
          across US, EU, JP, and KR timezones.
        </p>

        <p>
          Reach out: <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{' '}
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </article>
    </div>
  );
}
