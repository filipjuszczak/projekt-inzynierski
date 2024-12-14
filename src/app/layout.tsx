import "@/app/globals.css";
import { Inter } from "next/font/google";
import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sunema",
  description:
    "Przeżyj filmy jak nigdy dotąd w kinie Sunema! Odkryj najnowsze hity, ciesz się specjalnymi seansami i rezerwuj bilety online, by zapewnić sobie idealny wieczór filmowy. Sunema - tu ożywają historie!"
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
        <Toaster
          position="top-center"
          toastOptions={{ duration: 5000 }}
          richColors
        />
      </body>
    </html>
  );
}
