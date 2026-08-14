import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f3f9",
};

export const metadata: Metadata = {
  title: "X-OS Studio - Interactive X (Twitter) Algorithm Decompiler & Visual Architecture",
  description: "Deconstruct all 2,015 files of the open-source X recommendation algorithm. Features interactive architecture diagrams, Phoenix neural scoring calculator, Tweet Doctor optimizer, and visual pipeline breakdown hosted at x.100xprompt.com.",
  keywords: [
    "X Algorithm",
    "Twitter Algorithm",
    "X Recommendation System",
    "Phoenix Transformer",
    "SimClusters",
    "X Algorithm Decompiler",
    "Algorithm Multiplier",
    "Heavy Ranker",
    "Tweet Optimization",
    "x.100xprompt.com",
    "100xprompt"
  ],
  authors: [{ name: "100xprompt", url: "https://100xprompt.com" }],
  metadataBase: new URL("https://x.100xprompt.com"),
  openGraph: {
    title: "X-OS Studio — Interactive X (Twitter) Algorithm Decompiler & Architecture Suite",
    description: "Crack the X recommendation algorithm: Decompile 2,015 files, test Phoenix neural ranker multipliers, and audit your tweets in real-time.",
    url: "https://x.100xprompt.com",
    siteName: "X-OS Studio by 100xprompt",
    images: [
      {
        url: "https://x.100xprompt.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "X-OS Studio by 100xprompt",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "X-OS Studio — Interactive X (Twitter) Algorithm Decompiler & Architecture Suite",
    description: "Crack the X recommendation algorithm: Decompile 2,015 files, test Phoenix neural ranker multipliers, and audit your tweets in real-time.",
    images: ["https://x.100xprompt.com/opengraph-image"],
    creator: "@100xprompt",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen overflow-hidden select-none font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
