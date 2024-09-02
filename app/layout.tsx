import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '../components/ui/Header';
import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body>
            <Header />
            <main className="pt-20 px-12">{children}</main>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
