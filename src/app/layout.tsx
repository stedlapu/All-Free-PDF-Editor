import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ToastProvider } from "@/components/ui/Toaster";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdfmaster.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PDFMaster – Free Online PDF Tools | Merge, Split, Compress & More",
    template: "%s | PDFMaster",
  },
  description:
    "Free browser-based PDF tools. Merge, split, compress, rotate, remove pages, reorder, add watermark, and edit PDFs. Your files never leave your browser — 100% private.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "rotate PDF",
    "remove pages",
    "add watermark",
    "PDF editor",
    "free PDF",
    "online PDF",
    "browser PDF",
    "no upload PDF",
  ],
  authors: [{ name: "PDFMaster" }],
  creator: "PDFMaster",
  publisher: "PDFMaster",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PDFMaster",
    title: "PDFMaster – Free Online PDF Tools",
    description:
      "Merge, split, compress, rotate and edit PDFs directly in your browser. Files never leave your device.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDFMaster – Free Online PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFMaster – Free Online PDF Tools",
    description:
      "Merge, split, compress, rotate and edit PDFs directly in your browser. Files never leave your device.",
    images: ["/og-image.png"],
    creator: "@pdfmaster",
  },

  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b1326] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ToastProvider>
            <Header />
            <main className="flex-1 page-transition">{children}</main>
            <Footer />
            <CookieConsent />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
