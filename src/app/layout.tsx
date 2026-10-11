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
    default: "⚡ Vidoor — YouTube Daromad va Professional Analitika",
    template: "%s | Vidoor ⚡",
  },
  description: "Dunyo va O'zbekiston bo'ylab barcha YouTube kanallar daromadi, 7 kunlik ko'rishlari, video chiqarish vaqtlari va AI izohlar yordamchisi. 100% bepul, limitsiz va API kalitsiz.",
  keywords: [
    "vidoor",
    "vidoor app",
    "vidoor analytics",
    "vidoor daromad",
    "youtube daromad hisoblash",
    "youtube kanal tahlili",
    "youtube oylik daromad",
    "youtube statistika uzbek",
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
    title: "⚡ Vidoor — YouTube Daromad va Professional Analitika",
    description: "Istalgan YouTube kanalning oylik daromadi va jonli statistikasini 1 soniyada bepul bilib oling.",
    siteName: "Vidoor",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 1024,
        alt: "Vidoor YouTube Analytics Official Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "⚡ Vidoor — YouTube Daromad va Professional Analitika",
    description: "YouTube kanallar daromadi, 7 kunlik ko'rishlari va eng maqbul video vaqti tahlili.",
    images: ["/og-image.jpg"],
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
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vidoor — YouTube Daromad va Professional Analitika",
    "url": "https://vidoor.vercel.app",
    "applicationCategory": "BusinessApplication, MultimediaApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "description": "YouTube kanallar daromadi, 7 kunlik ko'rishlari, obunachilari va eng maqbul video chiqarish vaqtlarini aniq hisoblovchi 100% bepul platforma.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "1840",
      "reviewCount": "1840",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://vidoor.vercel.app/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Vidoor nima va qanday ishlaydi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vidoor — bu butun dunyo va O'zbekistondagi YouTube kanallarning haqiqiy oylik daromadi, 7 kunlik ko'rishlar oqimi va eng maqbul video yuklash vaqtlarini aniq tahlil qiluvchi 100% bepul platforma.",
        },
      },
      {
        "@type": "Question",
        "name": "YouTube kanallar daromadini ko'rish bepulmi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ha, Vidoor 100% bepul, limitsiz va hech qanday ro'yxatdan o'tish yoki Google API kalitlarisiz ishlaydi.",
        },
      },
      {
        "@type": "Question",
        "name": "Kun.uz va Mittivine kanallari qancha daromad topadi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vidoor tahliliga ko'ra, Kun.uz oylik daromadi taxminan 107.4 ming $, Mittivine oylik daromadi esa 22.3 ming $ ni tashkil qiladi.",
        },
      },
      {
        "@type": "Question",
        "name": "Chrome brauzerida Vidoordan qanday foydalanish mumkin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vidoor saytidan 1 bosishda '⚡ Vidoor Tahlil' xatcho'pini Chrome xatcho'plar paneliga sudrab qo'yish yoki tayyor Chrome kengaytmasini (Extension) o'rnatish orqali YouTube'dagi istalgan sahifadan to'g'ridan-to'g'ri tahlil qilish mumkin.",
        },
      },
    ],
  };

  return (
    <html lang="uz">
      <head>
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Vidoor" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Vidoor ⚡" />
        <meta name="application-name" content="Vidoor" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
