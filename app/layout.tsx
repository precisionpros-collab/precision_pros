import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppBackground } from "@/components/layout/AppBackground";
import { HiddenAdminEntry } from "@/components/layout/HiddenAdminEntry";
import { AnalyticsTracker } from "@/components/layout/AnalyticsTracker";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Precision Pro's — Building Tomorrow's Intelligence",
  description: "AI Solutions, Software Development, Automation & Deployment. Your technology partner for the future.",
  keywords: ["AI Development", "Software Development", "Automation", "Machine Learning", "Web Apps", "Mobile Apps"],
  robots: { index: true, follow: true },
  icons: [
    { rel: 'icon', url: '/images/logo.jpeg', type: 'image/jpeg' },
    { rel: 'shortcut icon', url: '/images/logo.jpeg', type: 'image/jpeg' },
    { rel: 'apple-touch-icon', url: '/images/logo.jpeg' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable} ${playfair.variable}`}
    >
      <body className="grain antialiased">
        <ThemeProvider>
          <AppBackground />
          <HiddenAdminEntry />
          <AnalyticsTracker />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
