import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import Header from "../components/ui/Header";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider >
      <Providers>
        <html lang="en">
          <body>
            <header>
            </header>
            <Header />
            <main className="p-12">{children}</main>
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
