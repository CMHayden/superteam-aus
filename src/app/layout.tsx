import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Space_Mono } from "next/font/google";
import "@/lib/fontawesome";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  weight: "variable",
  axes: ["opsz"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

const siteUrl = getSiteUrl();

const siteTitle = "Superteam Australia";
const siteDescription =
  "Australia’s Solana community — builders, founders, designers, and operators shipping products, grants, and ecosystem wins together.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  authors: [{ name: siteTitle, url: siteUrl }],
  creator: siteTitle,
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: "/apple-icon",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
