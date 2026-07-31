'use client';

import { useState } from 'react';

export default function Login({
  api,
  onSuccess,
}: {
  api: string;
  onSuccess: (token: string) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch(`${api}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error ?? 'Sign in failed.');
      onSuccess(data.token);
    } catch (e2) {
      setErr(
        e2 instanceof Error && e2.message !== 'Failed to fetch'
          ? e2.message
          : 'Could not reach the admin API. Start it with `npm run dev-local`.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm-shell">
      <form className="adm-login" onSubmit={submit}>
        <p className="adm-brand">Portfolio admin</p>
        <label className="adm-field">
          <span className="adm-label">Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
        </label>
        <label className="adm-field">
          <span className="adm-label">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {err && <p className="adm-err">{err}</p>}
        <button type="submit" className="btn-pill btn-pill-solid" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
