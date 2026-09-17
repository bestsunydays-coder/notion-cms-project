import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import "./globals.css";
import "@/styles/accessibility.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 루트 메타데이터
 * 기본 사이트 정보를 설정합니다.
 */
export const metadata: Metadata = {
  // 기본 정보
  title: {
    default: "Notion 여행 가이드 블로그",
    template: "%s | Notion 여행 가이드 블로그",
  },
  description: "세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.",
  keywords: ["여행", "가이드", "블로그", "Notion"],
  authors: [{ name: "Notion CMS Project" }],
  creator: "Notion CMS Project",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://notion-cms.example.com",
    siteName: "Notion 여행 가이드 블로그",
    title: "Notion 여행 가이드 블로그",
    description: "세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Notion 여행 가이드 블로그",
    description: "세계 여행 가이드와 여행 팁을 공유하는 블로그입니다.",
    site: "@notonblog",
  },

  // 로봇 설정
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
};

/**
 * 뷰포트 설정
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        {/* 카노니컬 URL */}
        <link rel="canonical" href="https://notion-cms.example.com" />

        {/* 알터네이트 링크 */}
        <link rel="alternate" hrefLang="ko" href="https://notion-cms.example.com" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <AccessibilityProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
