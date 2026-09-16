import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PageTransition } from '@/components/layout/page-transition';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TimeBuddy — Dein smarter Kalender',
  description: 'Verwalte Termine und Erinnerungen einfach und übersichtlich',
  themeColor: '#0b0b0f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-ivory">
        <Navbar />
        <main className="relative z-10 flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
