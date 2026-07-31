import { coreCompetencies } from '@/lib/profile';

/** Core-competency card grid: a coloured rule, a heading, and the skill line. */
export default function Competencies() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {coreCompetencies.map((c, i) => (
        <div key={c.title} className="comp-card">
          <span className={`comp-rule comp-t${i + 1}`} aria-hidden="true" />
          <h3>{c.title}</h3>
          <p>{c.items}</p>
        </div>
      ))}
    </div>
  );
}
