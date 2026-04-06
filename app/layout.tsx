import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "./language-context";
import Nav from "./nav";
import Sidebar from "./sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RateSnap - Stock & Crypto Market Snapshot",
    template: "%s | RateSnap",
  },
  description: "Daily top 10 gainers & losers for KR stocks, US stocks, and crypto. Plus life tools: age, BMI, loan calculator and more.",
  keywords: ["stock market", "crypto", "KOSPI", "KOSDAQ", "NYSE", "NASDAQ", "Bitcoin", "top gainers", "top losers", "rate snap"],
  metadataBase: new URL("https://rate-snap.com"),
  verification: {
    google: "MonEK12xkfiRwDS7Uxw6iCZaroYf1GHztTivnR7fDwQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YX6R9QFS05" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YX6R9QFS05');
        `}</Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">
            <div className="flex">
              {/* 왼쪽 사이드바 메뉴 */}
              <Sidebar />

              {/* 페이지 콘텐츠 */}
              <div className="flex-1 min-w-0">
                {children}
              </div>

              {/* 광고 영역 — 준비 중 */}
            </div>
          </main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} RateSnap. Stock & Crypto Market Snapshot.
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
