import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import { portfolio } from "@/data/portfolio";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const title = "Ivan Alcantara | Mobile & Web Developer";
const description =
  "Ivan Alcantara — Mobile & Web Developer. Open to internship opportunities in 2026. React Native, Laravel, Next.js, Supabase.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07090d",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "Ivan Alcantara",
    "Mobile Developer",
    "Web Developer",
    "React Native",
    "Laravel",
    "Internship",
    "Philippines",
  ],
  authors: [{ name: portfolio.personal.fullName }],
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Ivan Alcantara Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-[#07090d] text-zinc-100 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <CustomCursor />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
