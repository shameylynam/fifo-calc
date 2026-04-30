import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Footer } from "@/components/blocks/Footer";
import { Header } from "@/components/blocks/Header";
import { PageContainer } from "@/components/blocks/PageContainer";

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
    <html lang="en" className="font-sans">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background text-foreground antialiased`}
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
