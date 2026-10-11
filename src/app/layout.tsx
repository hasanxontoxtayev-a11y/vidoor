import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vidoor.vercel.app"),
  title: {
    default: "Vidoor — VidIQ Bepul Muqobili & YouTube Analitika Platformasi",
    template: "%s | Vidoor",
  },
  description: "Dunyo va O'zbekiston bo'ylab barcha YouTube kanallar daromadi, 7 kunlik ko'rishlari, video chiqarish vaqtlari va AI izohlar yordamchisi. 100% bepul, limitsiz va API kalitsiz.",
  keywords: [
    "vidoor",
    "vidiq",
    "vidiq bepul muqobili",
    "youtube daromad hisoblash",
    "youtube kanal tahlili",
    "youtube oylik daromad",
    "youtube statistika uzbek",
    "vidiq extension uzbekcha",
    "kunuz daromadi",
    "mittivine daromadi",
    "youtube rpm hisoblash",
    "youtube analytics tool",
    "youtube seo uzbekistan",
  ],
  authors: [{ name: "Vidoor Team" }],
  creator: "Vidoor",
  publisher: "Vidoor",
  applicationName: "Vidoor",
  alternates: {
    canonical: "https://vidoor.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://vidoor.vercel.app",
    title: "Vidoor — VidIQ Bepul Muqobili & YouTube Analitika",
    description: "Istalgan YouTube kanalning oylik daromadi va jonli statistikasini 1 soniyada bepul bilib oling.",
    siteName: "Vidoor",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Vidoor YouTube Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidoor — VidIQ Bepul Muqobili & YouTube Analitika",
    description: "YouTube kanallar daromadi, 7 kunlik ko'rishlari va eng maqbul video vaqti tahlili.",
    images: ["/icon-512.png"],
  },
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
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vidoor - VidIQ Bepul Muqobili & YouTube Analitika",
    "url": "https://vidoor.vercel.app",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description": "YouTube kanallar daromadi, 7 kunlik ko'rishlari, obunachilari va eng maqbul video chiqarish vaqtlarini aniq hisoblovchi 100% bepul platforma.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vidoor.vercel.app/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="uz">
      <head>
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Vidoor" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
