import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { PageContainer } from "@/components/ui/PageContainer";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fifocalculator.net"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "FIFO Pay Calculator",
  description:
    "Calculate your take-home pay, tax, superannuation, and HECS repayments on a FIFO (Fly-In Fly-Out) work roster. Free, fast, and easy to use.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "FIFO Pay Calculator",
    description:
      "Calculate your take-home pay, tax, superannuation, and HECS repayments on a FIFO (Fly-In Fly-Out) work roster.",
    url: siteUrl,
    siteName: "FIFO Pay Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FIFO Pay Calculator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFO Pay Calculator",
    description:
      "Calculate your take-home pay, tax, superannuation, and HECS repayments on a FIFO work roster.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <PageContainer className="flex-1 py-8">
            <div className="w-full">{children}</div>
          </PageContainer>
          <Footer />
        </div>
      </body>
    </html>
  );
}
