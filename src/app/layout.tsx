import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidoor — YouTube Blogerlar Uchun Analitika va AI Yordamchi",
  description: "YouTube kanallarni chuqur tahlil qilish, yuklash soatlari, video davomiyligi, RPM va izohlarga do'stona AI javoblar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
