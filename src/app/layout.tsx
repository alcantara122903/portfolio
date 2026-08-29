import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import { portfolio } from "@/data/portfolio";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Ivan Alcantara | Mobile & Web Developer";
const description =
  "Portfolio of Ivan Alcantara, an Information Technology student specializing in Mobile and Web Applications with experience in React Native, Laravel, Supabase, REST APIs, databases, and software development.";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
