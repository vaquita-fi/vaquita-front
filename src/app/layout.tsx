import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaquita",
  description: "Save your money with Vaquita",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${alexandria.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
