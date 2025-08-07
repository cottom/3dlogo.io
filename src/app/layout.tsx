import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GlobalExportProvider } from "@/components/export/GlobalExportProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "3DLogo.io - Create Stunning 3D Logos",
    template: "%s | 3DLogo.io"
  },
  description: "Transform your ideas into stunning 3D logos with our powerful online editor. Create professional 3D logos with materials, animations, and export options.",
  keywords: ["3D logo", "logo creator", "3D design", "logo maker", "online editor"],
  authors: [{ name: "3DLogo.io Team" }],
  creator: "3DLogo.io",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://3dlogo.io",
    siteName: "3DLogo.io",
    title: "3DLogo.io - Create Stunning 3D Logos",
    description: "Transform your ideas into stunning 3D logos with our powerful online editor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "3DLogo.io - Create Stunning 3D Logos",
    description: "Transform your ideas into stunning 3D logos with our powerful online editor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalExportProvider>
          <Header />
          {children}
          <Footer />
        </GlobalExportProvider>
      </body>
    </html>
  );
}
