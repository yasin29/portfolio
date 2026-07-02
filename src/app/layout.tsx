import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

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
  metadataBase: new URL('https://yasinbillah.com'),
  title: 'Yasin Billah — Technical Project Manager',
  description:
    'Technical Project & Product Manager — 4 years in software, 3 years running projects end-to-end for international clients. AI-native delivery workflows that cut client timelines 3x. On-site & remote.',
  openGraph: {
    title: 'Yasin Billah — Technical Project Manager',
    description:
      'Technical Project & Product Manager. AI-native delivery workflows that cut client delivery 3x. On-site & remote.',
    url: 'https://yasinbillah.com',
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
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Demoway) inject attributes
          into <body> before hydration; this silences that one-element mismatch only. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <ScrollReveal />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
