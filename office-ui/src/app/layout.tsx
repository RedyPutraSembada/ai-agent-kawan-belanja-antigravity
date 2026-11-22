import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kantor Virtual — Kawan Belanja Marketing & Ads",
  description:
    "Dashboard monitoring real-time 4 divisi Marketing & Meta Ads Kawan Belanja (kawanbelanja.com)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100">
        {children}
      </body>
    </html>
  );
}
