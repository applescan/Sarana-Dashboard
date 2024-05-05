import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import Header from "./components/ui/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider >
      <html lang="en">
        <body>
          <header>
          </header>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
