import type { Metadata } from "next";
import Script from "next/script";
import Footer from "./footer";
import { LanguageProvider } from "./language-context";
import Nav from "./nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RateSnap - 생활 계산기 모음",
    template: "%s | RateSnap",
  },
  description:
    "만 나이, BMI, 대출 이자, 퇴직금, 기념일, 디데이, 음주측정, 이미지 압축 등 생활에 유용한 무료 계산기 모음",
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YX6R9QFS05"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YX6R9QFS05');
        `}</Script>
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <LanguageProvider>
          <div className="flex min-h-full flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
