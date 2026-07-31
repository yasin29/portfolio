'use client';

import { useEffect, useState } from 'react';
import { SECTIONS, type SectionDef } from './schema';
import Login from './Login';
import ListEditor from './ListEditor';
import ObjectEditor from './ObjectEditor';
import PasswordCard from './PasswordCard';

const API = process.env.NEXT_PUBLIC_CHAT_API ?? '';
const TOKEN_KEY = 'admin-token';

type Content = Record<string, unknown>;

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [active, setActive] = useState<SectionDef>(SECTIONS[0]);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem(TOKEN_KEY);
      if (t) setToken(t);
    } catch {}
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await fetch(`${API}/api/admin/content`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.status === 401) return signOut();
        setContent(await r.json());
      } catch {
        setError('Could not reach the admin API. Is it running on port 3100?');
      }
    })();
  }, [token]);

  // Guard against losing edits to a stray tab close or back-navigation.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function signOut() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {}
    setToken(null);
    setContent(null);
    setDirty(false);
  }

  function update(key: string, value: unknown) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
    setDirty(true);
    setStatus(null);
  }

  async function save() {
    if (!content || !token) return;
    setSaving(true);
    setError(null);
    try {
      const r = await fetch(`${API}/api/admin/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 401) return signOut();
      if (!r.ok) throw new Error(data.error ?? 'Save failed');
      setDirty(false);
      setStatus('Saved. Restart the dev server or rebuild to see it on the site.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <Login
        api={API}
        onSuccess={(t) => {
          try {
            sessionStorage.setItem(TOKEN_KEY, t);
          } catch {}
          setToken(t);
        }}
      />
    );
  }

  if (!content) {
    return (
      <div className="adm-shell">
        <p className="adm-loading">{error ?? 'Loading content…'}</p>
      </div>
    );
  }

  return (
    <div className="adm">
      <aside className="adm-side">
        <p className="adm-brand">Portfolio admin</p>
        <nav>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s)}
              className={active.key === s.key ? 'is-active' : ''}
            >
              <span>{s.label}</span>
              {Array.isArray(content[s.key]) && (
                <span className="adm-count">{(content[s.key] as unknown[]).length}</span>
              )}
            </button>
          ))}
        </nav>
        <button type="button" className="adm-signout" onClick={signOut}>
          Sign out
        </button>
      </aside>

      <main className="adm-main">
        <header className="adm-head">
          <div>
            <h1>{active.label}</h1>
            {active.hint && <p>{active.hint}</p>}
          </div>
          <div className="adm-actions">
            {dirty && <span className="adm-dirty">Unsaved changes</span>}
            <button
              type="button"
              className="btn-pill btn-pill-solid btn-sm"
              onClick={save}
              disabled={!dirty || saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {status && <p className="adm-ok">{status}</p>}
        {error && <p className="adm-err">{error}</p>}

        {active.key === '__password' ? (
          <PasswordCard api={API} token={token} onChanged={signOut} />
        ) : active.kind === 'object' ? (
          <ObjectEditor
            def={active}
            value={content[active.key] as Record<string, unknown>}
            token={token}
            onChange={(v) => update(active.key, v)}
          />
        ) : (
          <ListEditor
            def={active}
            value={(content[active.key] as Record<string, unknown>[]) ?? []}
            token={token}
            onChange={(v) => update(active.key, v)}
          />
        )}
      </main>
    </div>
  );
}
