type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export default function Section({ id, eyebrow, title, intro, children, action }: Props) {
  return (
    <section id={id} className="section">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="section-title">{title}</h2>
            {intro && <p className="mt-2 max-w-2xl text-[var(--muted)]">{intro}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
