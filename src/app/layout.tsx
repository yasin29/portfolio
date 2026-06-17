import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://yasinbillah.com'),
  title: 'Yasin Billah — Technical Project Manager',
  description:
    'Technical Project Manager with 4 years of experience shipping web and mobile products end-to-end across JP, KOR, US, and EU clients. AI-augmented delivery that cut client timelines 3x.',
  openGraph: {
    title: 'Yasin Billah — Technical Project Manager',
    description:
      '4 years end-to-end delivery. AI-augmented workflows that cut client delivery 3x. Remote, GMT+6.',
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
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
