'use client';

import { useState } from 'react';
import Field from './Field';
import Compose from './Compose';
import type { SectionDef } from './schema';

type Row = Record<string, unknown>;

/**
 * Add / edit / delete / reorder for a list collection, LinkedIn-style: rows
 * collapsed by default, one expanded for editing.
 */
export default function ListEditor({
  def,
  value,
  onChange,
  token,
}: {
  def: SectionDef;
  value: Row[];
  onChange: (v: Row[]) => void;
  token: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  // Some lists are plain strings (marquee names); wrap them for a uniform editor.
  const isScalar = def.titleField === '__self';
  const rows: Row[] = isScalar ? value.map((v) => ({ __self: v })) : value;

  function commit(next: Row[]) {
    onChange(isScalar ? (next.map((r) => r.__self) as unknown as Row[]) : next);
  }

  function patch(i: number, row: Row) {
    const next = [...rows];
    next[i] = row;
    commit(next);
  }

  function add() {
    const blank: Row = {};
    for (const f of def.fields) if (f.type === 'list') blank[f.key] = [];
    commit([...rows, blank]);
    setOpenIdx(rows.length);
  }

  function remove(i: number) {
    commit(rows.filter((_, n) => n !== i));
    setOpenIdx(null);
    setConfirmIdx(null);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
    setOpenIdx(j);
  }

  const titleOf = (r: Row, i: number) =>
    String(r[def.titleField ?? def.fields[0]?.key] ?? '') || `Item ${i + 1}`;

  return (
    <div className="adm-list">
      {rows.map((row, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className={`adm-row${open ? ' is-open' : ''}`}>
            <div className="adm-row-head">
              <button type="button" className="adm-row-title" onClick={() => setOpenIdx(open ? null : i)}>
                <span className="adm-row-name">{titleOf(row, i)}</span>
                {def.subtitleField && (
                  <span className="adm-row-sub">{String(row[def.subtitleField] ?? '')}</span>
                )}
              </button>
              <div className="adm-row-tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                {confirmIdx === i ? (
                  <>
                    <button type="button" className="adm-danger" onClick={() => remove(i)}>
                      Delete
                    </button>
                    <button type="button" onClick={() => setConfirmIdx(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirmIdx(i)} aria-label="Remove">
                    ✕
                  </button>
                )}
              </div>
            </div>

            {open && (
              <div className="adm-row-body">
                {def.fields.map((f) => (
                  <Field
                    key={f.key}
                    def={f}
                    value={row[f.key]}
                    token={token}
                    slug={String(row[def.slugField ?? 'slug'] ?? '')}
                    onChange={(v) => patch(i, { ...row, [f.key]: v })}
                  />
                ))}
                {def.key === 'projects' && <Compose project={row} token={token} />}
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className="adm-add" onClick={add}>
        + Add {def.label.replace(/s$/, '').toLowerCase()}
      </button>
    </div>
  );
}
