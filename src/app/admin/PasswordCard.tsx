'use client';

import { useState } from 'react';

export default function PasswordCard({
  api,
  token,
  onChanged,
}: {
  api: string;
  token: string;
  onChanged: () => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (next !== confirm) return setErr('The new passwords do not match.');
    if (next.length < 10) return setErr('Use at least 10 characters.');

    setBusy(true);
    try {
      const r = await fetch(`${api}/api/admin/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current, next }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error ?? 'Could not change the password.');
      setMsg('Password changed. Signing you out…');
      setTimeout(onChanged, 1200);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Could not change the password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="adm-card adm-narrow" onSubmit={submit}>
      <label className="adm-field">
        <span className="adm-label">Current password</span>
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
      </label>
      <label className="adm-field">
        <span className="adm-label">
          New password<em>At least 10 characters</em>
        </span>
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
      </label>
      <label className="adm-field">
        <span className="adm-label">Confirm new password</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </label>
      {err && <p className="adm-err">{err}</p>}
      {msg && <p className="adm-ok">{msg}</p>}
      <button type="submit" className="btn-pill btn-pill-solid btn-sm" disabled={busy}>
        {busy ? 'Changing…' : 'Change password'}
      </button>
      <p className="adm-note">
        Changing the password signs out every existing session, including this one.
      </p>
    </form>
  );
}
