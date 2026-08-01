'use client';

import { useRef, useState } from 'react';
import type { FieldDef } from './schema';
import { basePath } from '@/lib/profile';

const API = process.env.NEXT_PUBLIC_CHAT_API ?? '';

type Row = Record<string, unknown>;

/** One editor input, chosen by field type. Nests for group and repeat. */
export default function Field({
  def,
  value,
  onChange,
  token,
  slug,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  token?: string;
  slug?: string;
}) {
  const id = `f-${def.key}-${Math.random().toString(36).slice(2, 7)}`;

  const label = (
    <span className="adm-label">
      {def.label}
      {def.hint && <em>{def.hint}</em>}
    </span>
  );

  /* ---------- group: a fixed object of sub-fields ---------- */
  if (def.type === 'group') {
    const obj = (value ?? {}) as Row;
    const empty = Object.values(obj).every((v) => !v);
    return (
      <div className="adm-group">
        <div className="adm-group-head">
          {label}
          {!empty && (
            <button type="button" className="adm-mini" onClick={() => onChange(undefined)}>
              Clear
            </button>
          )}
        </div>
        <div className="adm-group-body">
          {def.fields?.map((f) => (
            <Field
              key={f.key}
              def={f}
              value={obj[f.key]}
              token={token}
              slug={slug}
              onChange={(v) => onChange({ ...obj, [f.key]: v })}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- repeat: an array of objects ---------- */
  if (def.type === 'repeat') {
    const rows = (Array.isArray(value) ? value : []) as Row[];
    const setRows = (next: Row[]) => onChange(next.length ? next : undefined);
    const titleOf = (r: Row, i: number) =>
      String(r[def.titleField ?? def.fields?.[0]?.key ?? ''] ?? '') || `Item ${i + 1}`;

    return (
      <div className="adm-group">
        <div className="adm-group-head">{label}</div>
        <div className="adm-repeat">
          {rows.map((row, i) => (
            <div key={i} className="adm-sub">
              <div className="adm-sub-head">
                <span className="adm-sub-n">{i + 1}</span>
                <span className="adm-sub-title">{titleOf(row, i)}</span>
                <div className="adm-row-tools">
                  <button
                    type="button"
                    onClick={() => {
                      if (i === 0) return;
                      const n = [...rows];
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      setRows(n);
                    }}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (i === rows.length - 1) return;
                      const n = [...rows];
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      setRows(n);
                    }}
                    disabled={i === rows.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setRows(rows.filter((_, n) => n !== i))}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="adm-sub-body">
                {def.fields?.map((f) => (
                  <Field
                    key={f.key}
                    def={f}
                    value={row[f.key]}
                    token={token}
                    slug={slug}
                    onChange={(v) => {
                      const n = [...rows];
                      n[i] = { ...row, [f.key]: v };
                      setRows(n);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <button type="button" className="adm-add" onClick={() => setRows([...rows, {}])}>
            + Add {def.addLabel ?? 'item'}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- image: upload or path ---------- */
  if (def.type === 'image') {
    return <ImageField def={def} value={value} onChange={onChange} token={token} slug={slug} label={label} />;
  }

  /* ---------- file: upload or path ---------- */
  if (def.type === 'file') {
    return <FileField def={def} value={value} onChange={onChange} token={token} label={label} />;
  }

  /* ---------- select ---------- */
  if (def.type === 'select') {
    return (
      <label className="adm-field" htmlFor={id}>
        {label}
        <select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value || undefined)}>
          {(def.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o === '' ? '—' : o}
            </option>
          ))}
        </select>
      </label>
    );
  }

  /* ---------- list of strings ---------- */
  if (def.type === 'list') {
    const text = Array.isArray(value) ? value.join('\n') : '';
    return (
      <label className="adm-field" htmlFor={id}>
        {label}
        <textarea
          id={id}
          rows={Math.min(10, Math.max(3, text.split('\n').length + 1))}
          value={text}
          onChange={(e) => {
            const arr = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
            onChange(arr.length ? arr : undefined);
          }}
        />
      </label>
    );
  }

  /* ---------- raw JSON escape hatch ---------- */
  if (def.type === 'json') {
    const text = value === undefined ? '' : JSON.stringify(value, null, 2);
    return (
      <label className="adm-field" htmlFor={id}>
        {label}
        <textarea
          id={id}
          className="adm-json"
          rows={Math.min(18, Math.max(4, text.split('\n').length))}
          defaultValue={text}
          onBlur={(e) => {
            const raw = e.target.value.trim();
            if (!raw) return onChange(undefined);
            try {
              onChange(JSON.parse(raw));
              e.target.classList.remove('is-bad');
            } catch {
              e.target.classList.add('is-bad');
            }
          }}
        />
      </label>
    );
  }

  if (def.type === 'textarea') {
    return (
      <label className="adm-field" htmlFor={id}>
        {label}
        <textarea id={id} rows={4} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }

  return (
    <label className="adm-field" htmlFor={id}>
      {label}
      <input
        id={id}
        type={def.type === 'url' ? 'url' : 'text'}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/* ---------------- image field ---------------- */

function ImageField({
  def,
  value,
  onChange,
  token,
  slug,
  label,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  token?: string;
  slug?: string;
  label: React.ReactNode;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const src = String(value ?? '');

  async function upload(file: File) {
    if (!token) return setErr('Sign in again to upload.');
    setBusy(true);
    setErr(null);
    try {
      const buf = await file.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      const r = await fetch(`${API}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug: slug || 'misc', filename: file.name, data: b64 }),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(out.error ?? 'Upload failed');
      onChange(out.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-field">
      {label}
      <div className="adm-image">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="adm-thumb" />
        ) : (
          <span className="adm-thumb is-empty">no image</span>
        )}
        <div className="adm-image-controls">
          <input
            type="text"
            value={src}
            placeholder="/case-studies/slug/screen-1.webp"
            onChange={(e) => onChange(e.target.value || undefined)}
          />
          <div className="adm-image-actions">
            <button type="button" className="adm-mini" onClick={() => fileRef.current?.click()} disabled={busy}>
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            {src && (
              <button type="button" className="adm-mini" onClick={() => onChange(undefined)}>
                Remove
              </button>
            )}
          </div>
          {err && <p className="adm-err">{err}</p>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

/**
 * A document — the resume — as an upload rather than a typed path.
 *
 * The path stays editable because the file may already be in /public from
 * before this control existed, and retyping it is sometimes the fastest fix.
 * The View link is the useful part: it opens what the site will actually
 * serve, which is the only way to catch a path that points at nothing.
 */
function FileField({
  def,
  value,
  onChange,
  token,
  label,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  token?: string;
  label: React.ReactNode;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const src = String(value ?? '');

  async function upload(file: File) {
    if (!token) return setErr('Sign in again to upload.');
    setBusy(true);
    setErr(null);
    setSaved(null);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      // A PDF is megabytes; spreading it into String.fromCharCode blows the
      // argument limit, so chunk it.
      let bin = '';
      for (let i = 0; i < bytes.length; i += 8192) {
        bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
      }
      const r = await fetch(`${API}/api/admin/upload-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, data: btoa(bin) }),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(out.error ?? 'Upload failed');
      onChange(out.path);
      setSaved(`Saved ${(out.bytes / 1024 / 1024).toFixed(1)}MB to public${out.path}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-field">
      {label}
      <div className="adm-file">
        <input
          type="text"
          value={src}
          placeholder="/My-Resume.pdf"
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        <div className="adm-image-actions">
          <button type="button" className="adm-mini" onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : src ? 'Replace' : 'Upload'}
          </button>
          {src && (
            <a className="adm-mini" href={`${basePath}${src}`} target="_blank" rel="noreferrer">
              View
            </a>
          )}
          {src && (
            <button type="button" className="adm-mini" onClick={() => { onChange(undefined); setSaved(null); }}>
              Remove
            </button>
          )}
        </div>
        {saved && <p className="adm-ok">{saved}</p>}
        {err && <p className="adm-err">{err}</p>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
