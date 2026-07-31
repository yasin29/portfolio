import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Intro from '@/components/Intro';
import ChatWidget from '@/components/ChatWidget';
import { JsonLd, personSchema, websiteSchema } from '@/lib/seo';
import { absoluteUrl } from '@/lib/profile';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: {
    default: 'Yasin Billah — Technical Project Manager',
    template: '%s | Yasin Billah',
  },
  alternates: { canonical: absoluteUrl('/') },
  authors: [{ name: 'Yasin Billah', url: absoluteUrl('/') }],
  creator: 'Yasin Billah',
  keywords: [
    'Yasin Billah',
    'Technical Project Manager',
    'AI-native delivery manager',
    'AI-native delivery',
    'Agile Scrum project manager',
    'software project manager Dhaka',
    'remote project manager',
  ],
  robots: { index: true, follow: true },
  description:
    'Technical Project Manager — 4 years in software, 3 running projects end-to-end for international clients. AI-native delivery cut the same work from 3 months and 5 people to 1 month and 3. On-site & remote.',
  openGraph: {
    title: 'Yasin Billah — Technical Project Manager',
    description:
      'Technical Project Manager. AI-native delivery cut the same work from 3 months and 5 people to 1 month and 3. On-site & remote.',
    url: absoluteUrl('/'),
    siteName: 'Yasin Billah',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
      // the theme script below stamps data-theme on <html> before hydration
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Demoway) inject attributes
          into <body> before hydration; this silences that one-element mismatch only. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {/* Runs before first paint: applies the saved theme (dark by default, so
            light never flashes dark) and decides whether to show the intro.

            Uses a timestamped localStorage marker rather than sessionStorage:
            sessionStorage is per-tab, so opening a case study in a new tab read
            as a brand-new visitor and re-gated the page. A 30-minute window
            means anything within one visit is recognised, while coming back
            later still gets the intro. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');d.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){d.dataset.theme='dark';}try{var K='intro-seen-at',TTL=1800000,now=Date.now(),last=parseInt(localStorage.getItem(K)||'0',10);if(!last||now-last>TTL){d.dataset.intro='show';}else{localStorage.setItem(K,String(now));}}catch(e){}})();`,
          }}
        />
        <JsonLd data={[personSchema(), websiteSchema()]} />
        <Intro />
        <ScrollReveal />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
