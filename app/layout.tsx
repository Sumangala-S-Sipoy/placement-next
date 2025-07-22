import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SDMCET - Campus Connect",
  description: "Connect students with placement opportunities at SDMCET",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen bg-background selection:bg-primary/20`}
      >
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
