import Image from 'next/image';
import { profile, story, howIOperate } from '@/lib/profile';
import CopyButton from './CopyButton';

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 14a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L11 5.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 10a5 5 0 00-7.07 0L4.8 12.12a5 5 0 007.07 7.07L13 18.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const rows = [
  { label: 'Based in', value: profile.location },
  { label: 'Experience', value: '4 yrs total · 3 as PM' },
  { label: 'Education', value: 'B.Sc. in Information & Communication Engineering' },
  { label: 'Focus', value: profile.focus },
  { label: 'Work mode', value: profile.workMode },
];

export default function Story() {
  return (
    <section id="story" className="section">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.35fr] lg:gap-14">
          {/* profile card */}
          <div data-reveal>
            <div className="profile-card lg:sticky lg:top-24">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[var(--border-strong)]">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    fill
                    sizes="4rem"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-semibold">{profile.name}</p>
                  <p className="text-sm text-[var(--muted)]">{profile.role}</p>
                </div>
              </div>

              <span className="hero-avail mt-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                {profile.availability}
              </span>

              <div className="mt-5">
                {rows.map((r) => (
                  <div key={r.label} className="profile-row">
                    <span className="profile-row-label">{r.label}</span>
                    <span className="profile-row-value">{r.value}</span>
                  </div>
                ))}
                {/* phone — tel: link, WhatsApp icon links to wa.me, copy icon */}
                <div className="profile-row">
                  <span className="profile-row-label">Phone</span>
                  <span className="inline-flex items-center gap-2">
                    <a
                      href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                      className="font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      {profile.phone}
                    </a>
                    <a
                      href={profile.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      title="WhatsApp"
                      className="text-[#25d366] transition-opacity hover:opacity-75"
                    >
                      <WhatsAppIcon size={15} />
                    </a>
                    <CopyButton text={profile.phone} label="phone number" className="h-7 w-7" />
                  </span>
                </div>
                {/* email — mailto link + copy icon */}
                <div className="profile-row">
                  <span className="profile-row-label">Email</span>
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <a
                      href={`mailto:${profile.email}`}
                      className="truncate font-semibold text-[var(--foreground)] hover:text-[var(--accent)]"
                    >
                      {profile.email}
                    </a>
                    <CopyButton text={profile.email} label="email address" className="h-7 w-7" />
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a href={`mailto:${profile.email}`} className="icon-btn" aria-label="Email">
                  <MailIcon />
                </a>
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-btn"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-btn"
                  aria-label="LinkedIn"
                >
                  <LinkIcon />
                </a>
                <a href={profile.resume} download className="icon-btn" aria-label="Download resume">
                  <DownloadIcon />
                </a>
              </div>
            </div>
          </div>

          {/* story */}
          <div>
            <div data-reveal>
              <p className="eyebrow">— The story</p>
              <p className="story-statement mt-6">
                {story.statementLead}
                <em>{story.statementEm}</em>
                {story.statementTail}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {story.chips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-7 space-y-4 text-[var(--muted)] leading-relaxed">
                {story.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* how I operate */}
            <div className="mt-12" data-reveal data-reveal-delay="80">
              <p className="eyebrow">— How I operate</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {howIOperate.map((p, i) => (
                  <div key={p.title} className={`op-card op-g${i + 1}`}>
                    <div className="op-card-inner">
                      <h3>{p.title}</h3>
                      <p>{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
