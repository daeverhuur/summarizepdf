import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/layout/AppShell";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteName = "SummarizePDF";
const siteUrl = "https://summarizepdf.com";
const siteDescription = "Upload your PDF and get instant AI-powered summaries. Extract key insights, chat with your documents, and boost productivity with GPT-4.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  
  // Basic SEO
  title: {
    default: "SummarizePDF - AI-Powered PDF Summarization in Seconds",
    template: "%s | SummarizePDF",
  },
  description: siteDescription,
  keywords: [
    "PDF summarizer",
    "AI PDF summary",
    "summarize PDF",
    "PDF to summary",
    "document summarization",
    "AI document analysis",
    "chat with PDF",
    "PDF reader AI",
    "GPT PDF",
    "extract PDF insights",
    "PDF key points",
    "automatic PDF summary",
    "research paper summarizer",
    "legal document summarizer",
    "academic PDF summarizer",
  ],
  
  // Authors and Creator
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "SummarizePDF - AI-Powered PDF Summarization in Seconds",
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SummarizePDF - AI PDF Summarization",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "SummarizePDF - AI-Powered PDF Summarization",
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@summarizepdf",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification (add your IDs when available)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  
  // App specific
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
  },
  
  // Format detection
  formatDetection: {
    telephone: false,
  },
  
  // Category
  category: "Productivity",
  
  // Alternates
  alternates: {
    canonical: siteUrl,
  },
};

// Structured Data (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/summarizepdf",
        "https://linkedin.com/company/summarizepdf",
        "https://github.com/summarizepdf",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: siteName,
      description: siteDescription,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free tier with 5 PDFs per day",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "10000",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "AI-Powered PDF Summarization",
        "Chat with PDF Documents",
        "Export to Multiple Formats",
        "Document Library",
        "Team Collaboration",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
      </head>
      <body className={`${sora.variable} font-sans antialiased bg-white text-slate-900`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
