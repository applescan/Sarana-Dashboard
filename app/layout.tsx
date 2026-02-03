import { ClerkProvider } from '@clerk/nextjs';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/ui/Header';
import Providers from '@/components/Providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en" className={jakarta.variable}>
          <body className="bg-surface text-secondary-foreground">
            <div className="relative min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_rgba(2,6,23,0))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(192,132,252,0.25),_rgba(2,6,23,0))]" />
                <div className="absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-accent/30 blur-[140px]" />
              </div>
              <Header />
              <main className="relative px-4 pt-28 pb-10 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">{children}</div>
              </main>
            </div>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
