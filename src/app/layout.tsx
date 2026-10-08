import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { AccessProvider } from "@/components/AccessProvider";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RobOnHood — Run at the speed of signal",
  description:
    "RobOnHood unifies your events, systems and workflows into one live surface, so your team sees what matters and acts before it becomes an incident.",
  openGraph: {
    title: "RobOnHood — Run at the speed of signal",
    description:
      "One live surface for AI analysis, market signals, and trading.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050607",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-fog antialiased">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[80] -translate-y-20 bg-fog px-4 py-2 text-sm font-medium text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <AccessProvider>{children}</AccessProvider>
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}
