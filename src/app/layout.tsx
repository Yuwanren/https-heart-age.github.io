import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuizProvider } from "@/components/QuizProvider";
import { AccessProvider } from "@/components/AccessProvider";
import { resolveShareSite } from "@/lib/share";
import "./globals.css";

const shareSite = resolveShareSite({ configuredUrl: process.env.NEXT_PUBLIC_SITE_URL });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: shareSite.url ? new URL(shareSite.url) : undefined,
  title: {
    default: "INNER AGE",
    template: "%s · INNER AGE",
  },
  description: "选择一项测试。结果在当前浏览器生成，不会上传。",
  applicationName: "INNER AGE",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F7F3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <QuizProvider>
          <AccessProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
          >
            跳到主要内容
          </a>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
          </AccessProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
