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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YX6R9QFS05"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var debugSearch = new URLSearchParams(window.location.search);
          var hasDebugSignal = debugSearch.has('gtm_debug') || debugSearch.has('_dbg');
          gtag('js', new Date());
          gtag('config', 'G-YX6R9QFS05', hasDebugSignal ? { debug_mode: true } : {});
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
