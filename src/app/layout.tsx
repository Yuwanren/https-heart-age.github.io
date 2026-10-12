import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuizProvider } from "@/components/QuizProvider";
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
    default: "心理年龄测试",
    template: "%s · 心理年龄测试",
  },
  description: "你的年龄写在身份证上，你的内心又停留在哪个阶段？20 道关于情绪、关系与自我认知的选择题。",
  applicationName: "心理年龄测试",
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
        </QuizProvider>
      </body>
    </html>
  );
}
