import ProjectCard from '@/components/ProjectCard';
import { getAllCaseStudies } from '@/lib/case-studies';

export const metadata = {
  title: 'Case studies — Yasin Billah',
  description:
    'Eight project case studies across marketplaces, EdTech, ERP, mobile-AI, and HR-tech.',
};

export default function CaseStudiesIndex() {
  const studies = getAllCaseStudies();
  return (
    <div className="container-page py-16 md:py-20">
      <p className="eyebrow">Portfolio</p>
      <h1 className="section-title text-3xl md:text-4xl">Case studies</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Eight projects I owned end-to-end — across marketplaces, EdTech, ERP, mobile-AI, and
        HR-tech. Each one is the source for an interview-ready STAR story.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studies.map((s) => (
          <ProjectCard key={s.slug} study={s} />
        ))}
      </div>
    </div>
  );
}
