'use client';

import Field from './Field';
import type { SectionDef } from './schema';

/** Edits a single object, e.g. the profile block. */
export default function ObjectEditor({
  def,
  value,
  onChange,
  token,
}: {
  def: SectionDef;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  token: string;
}) {
  return (
    <div className="adm-card">
      {def.fields.map((f) => (
        <Field
          key={f.key}
          def={f}
          value={value?.[f.key]}
          token={token}
          slug="profile"
          onChange={(v) => onChange({ ...value, [f.key]: v })}
        />
      ))}
    </div>
  );
}
