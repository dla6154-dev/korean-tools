import type { Metadata } from "next";
import Script from "next/script";
import Footer from "./footer";
import { LanguageProvider } from "./language-context";
import Nav from "./nav";
import { ThemeProvider } from "./theme-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Korean Tools - 생활 유틸리티 도구 모음",
    template: "%s | Korean Tools",
  },
  description:
    "만 나이, 단위 가격 비교, 이미지 압축, 보색 찾기, 대출 계산 등 일상에서 바로 쓰는 무료 온라인 도구 모음",
  keywords: [
    "만 나이 계산기",
    "BMI 계산기",
    "대출 이자 계산기",
    "퇴직금 계산기",
    "기념일 계산기",
    "디데이 계산기",
    "이미지 압축",
    "글자수 세기",
  ],
  metadataBase: new URL("https://rate-snap.com"),
  alternates: {
    canonical: "https://rate-snap.com",
    languages: {
      "ko": "https://rate-snap.com",
      "en": "https://rate-snap.com",
      "x-default": "https://rate-snap.com",
    },
  },
  verification: {
    google: "MonEK12xkfiRwDS7Uxw6iCZaroYf1GHztTivnR7fDwQ",
    other: {
      "naver-site-verification": "6acaa4c58d86b46780c844140e5242e6026c4f1b",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        {/* 다크모드 flash 방지 */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t==null&&d)){document.documentElement.classList.add('dark');}})();` }} />
        {/* WebSite 구조화 데이터 */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Korean Tools",
          "url": "https://rate-snap.com",
          "description": "날짜 계산, 텍스트 변환, 이미지 처리, 생활 계산까지. 한국에서 자주 쓰는 실용 도구를 한곳에 모았습니다.",
          "inLanguage": ["ko", "en"],
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": "https://rate-snap.com/?q={search_term_string}" },
            "query-input": "required name=search_term_string"
          }
        }) }} />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VX6R9QFSQ5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var debugSearch = new URLSearchParams(window.location.search);
          var hasDebugSignal = debugSearch.has('gtm_debug') || debugSearch.has('_dbg');
          gtag('js', new Date());
          gtag('config', 'G-VX6R9QFSQ5', hasDebugSignal ? { debug_mode: true } : {});
        `}</Script>
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex min-h-full flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
