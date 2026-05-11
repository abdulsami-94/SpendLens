import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Spend Audit",
  description: "Find out if you're overpaying for AI tools. Get an instant audit of your stack and see exactly where you can cut costs — free, no login required.",
  openGraph: {
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out if you're overpaying for AI tools. Get an instant audit of your stack and see exactly where you can cut costs — free, no login required.",
    url: "https://spend-lens-six.vercel.app",
    siteName: "SpendLens",
    images: [
      {
        url: "https://spend-lens-six.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "SpendLens AI Spend Audit",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out if you're overpaying for AI tools. Get an instant audit of your stack and see exactly where you can cut costs — free, no login required.",
    images: ["https://spend-lens-six.vercel.app/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
