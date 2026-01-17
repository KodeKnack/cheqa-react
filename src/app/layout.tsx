import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheqa - Expense Tracker",
  description: "Track your expenses with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const saved = localStorage.getItem('cheqa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (_) {}
})();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16 sm:pb-0 flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <Providers>
            <PageTransition>
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </PageTransition>
          </Providers>
        </ThemeProvider>
        <ScrollToTopButton />
        <MobileNav />
      </body>
    </html>
  );
}
