import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ReactNode } from 'react';
import Header from '../components/ui/Header';
import Providers from '@/components/Providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body>
            <Header />
            <main className="pt-24 px-4 sm:px-6">{children}</main>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
