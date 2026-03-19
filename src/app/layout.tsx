import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THR Tracker",
  description: "Pencatatan THR masuk dan keluar saat Lebaran.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${lora.variable} h-full`}>
      <body className="min-h-full bg-gradient-to-b from-emerald-50 via-[#f7f8f2] to-[#fffaf0] font-sans text-emerald-950 antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
